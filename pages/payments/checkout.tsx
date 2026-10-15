import DepositForm from '../../components/DepositForm';

export default function CheckoutPage() {
  // demo userId none — replace with logged-in user id
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Make a Deposit</h1>
      <DepositForm />
    </main>
  );
}
