import Image from 'next/image';

const paymentMethods = [
  { name: 'COD', width: 40, height: 25 },
  { name: 'Paytm', src: '/paytm.svg', width: 55, height: 20 },
  { name: 'PhonePe', src: '/phonepe.svg', width: 80, height: 20 },
  { name: 'GPay', src: '/gpay.svg', width: 50, height: 20 },
];

export default function PaymentIcons() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-full bg-background/70 backdrop-blur-sm border-border/50 border shadow-sm">
        <span className="font-semibold text-sm text-muted-foreground pl-1">COD</span>
        <div className="w-px h-5 bg-border"></div>
        <div className="flex items-center gap-4">
             <Image src="https://upload.wikimedia.org/wikipedia/commons/4/42/Paytm_logo.svg" alt="Paytm" width={55} height={18} />
             <Image src="https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" alt="PhonePe" width={80} height={20} />
             <Image src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="Google Pay" width={50} height={20} />
        </div>
    </div>
  );
}
