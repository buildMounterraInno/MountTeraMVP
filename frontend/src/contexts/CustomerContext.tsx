import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

export interface Customer {
  id?: string;
  auth_user_id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  date_of_birth?: string;
  gender?: string;
  avatar_url?: string;
  profile_completion_percentage?: number;
  account_status?: string;
  created_at?: string;
  updated_at?: string;
  last_login_at?: string;
}

interface CustomerContextType {
  customer: Customer | null;
  loading: boolean;
  error: string | null;
  createCustomer: (customerData: Partial<Customer>) => Promise<Customer>;
  updateCustomer: (updates: Partial<Customer>) => Promise<Customer>;
  refreshCustomer: () => Promise<void>;
  calculateCompletionPercentage: (customer: Customer) => number;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
};

interface CustomerProviderProps {
  children: ReactNode;
}

export const CustomerProvider: React.FC<CustomerProviderProps> = ({ children }) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();

  // Calculate profile completion percentage
  const calculateCompletionPercentage = (customerData: Customer): number => {
    const requiredFields = [
      'first_name',
      'last_name',
      'email',
      'gender',
      'date_of_birth'
    ];

    const optionalFields = [
      'phone_number',
      'avatar_url'
    ];

    const requiredFieldsCompleted = requiredFields.filter(field => {
      const value = customerData[field as keyof Customer];
      return value !== null && value !== undefined && value !== '';
    }).length;

    const optionalFieldsCompleted = optionalFields.filter(field => {
      const value = customerData[field as keyof Customer];
      return value !== null && value !== undefined && value !== '';
    }).length;

    // Required fields are worth 85%, optional fields 15%
    const requiredPercentage = (requiredFieldsCompleted / requiredFields.length) * 85;
    const optionalPercentage = (optionalFieldsCompleted / optionalFields.length) * 15;

    return Math.round(requiredPercentage + optionalPercentage);
  };

  // Fetch customer data
  const fetchCustomer = async () => {
    if (!user?.id) {
      setCustomer(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('customers')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw fetchError;
      }

      if (data) {
        // Calculate completion percentage
        const completionPercentage = calculateCompletionPercentage(data);
        
        // Update completion percentage if it's different
        if (data.profile_completion_percentage !== completionPercentage) {
          const { data: updatedData } = await supabase
            .from('customers')
            .update({ profile_completion_percentage: completionPercentage })
            .eq('id', data.id)
            .select()
            .single();
          
          if (updatedData) {
            setCustomer(updatedData);
          } else {
            setCustomer({ ...data, profile_completion_percentage: completionPercentage });
          }
        } else {
          setCustomer(data);
        }
      } else {
        setCustomer(null);
      }
    } catch (err) {
      console.error('Error fetching customer:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch customer data');
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  };

  // Create new customer record
  const createCustomer = async (customerData: Partial<Customer>, authUserId?: string): Promise<Customer> => {
    const userId = authUserId || user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    try {
      setLoading(true);
      setError(null);

      const newCustomerData = {
        ...customerData,
        auth_user_id: userId,
        email: customerData.email,
        profile_completion_percentage: calculateCompletionPercentage(customerData as Customer),
        onboarding_completed: true, // Set to true when created through onboarding
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error: createError } = await supabase
        .from('customers')
        .insert([newCustomerData])
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      setCustomer(data);
      return data;
    } catch (err) {
      console.error('Error creating customer:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create customer';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Update customer record
  const updateCustomer = async (updates: Partial<Customer>): Promise<Customer> => {
    if (!customer?.id) {
      throw new Error('No customer record found');
    }

    try {
      setLoading(true);
      setError(null);

      const updatedData = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      // Calculate new completion percentage
      const newCustomerData = { ...customer, ...updatedData };
      updatedData.profile_completion_percentage = calculateCompletionPercentage(newCustomerData);

      const { data, error: updateError } = await supabase
        .from('customers')
        .update(updatedData)
        .eq('id', customer.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      setCustomer(data);
      return data;
    } catch (err) {
      console.error('Error updating customer:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update customer';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Refresh customer data
  const refreshCustomer = async () => {
    await fetchCustomer();
  };

  // Update last login time
  const updateLastLogin = async () => {
    if (customer?.id) {
      try {
        await supabase
          .from('customers')
          .update({ last_login_at: new Date().toISOString() })
          .eq('id', customer.id);
      } catch (err) {
        console.error('Error updating last login:', err);
      }
    }
  };

  // Effects
  useEffect(() => {
    // Wait for auth to finish loading before making any requests
    if (authLoading) {
      return; // Still loading auth, don't do anything yet
    }

    if (user) {
      fetchCustomer();
      updateLastLogin();
    } else {
      setCustomer(null);
      setLoading(false);
    }
  }, [user, authLoading]);

  // Listen for real-time updates
  useEffect(() => {
    if (!user?.id) return;

    const subscription = supabase
      .channel(`customer_${user.id}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'customers',
          filter: `auth_user_id=eq.${user.id}`
        }, 
        (payload) => {
          console.log('Customer data changed:', payload);
          if (payload.eventType === 'UPDATE' && payload.new) {
            setCustomer(payload.new as Customer);
          } else if (payload.eventType === 'DELETE') {
            setCustomer(null);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id]);

  const value: CustomerContextType = {
    customer,
    loading,
    error,
    createCustomer,
    updateCustomer,
    refreshCustomer,
    calculateCompletionPercentage
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
};

export default CustomerContext;