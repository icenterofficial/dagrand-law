import { Toaster as SonnerToaster } from 'sonner';

export const Toaster = () => {
  return (
    <SonnerToaster 
        position="top-center" 
        richColors 
        theme="light"
        toastOptions={{
            style: {
                background: '#153c63',
                color: 'white',
                border: '1px solid #b49b67',
            },
            className: 'font-sans'
        }}
    />
  );
};