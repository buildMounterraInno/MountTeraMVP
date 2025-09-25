// PhonePe Checkout TypeScript declarations
declare global {
  interface Window {
    PhonePeCheckout: {
      transact: (options: {
        tokenUrl: string;
        callback?: (response: string) => void;
        type?: 'IFRAME' | 'REDIRECT';
      }) => void;
      closePage: () => void;
    };
  }
}

export {};