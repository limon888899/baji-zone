import AdminLayout from '../../../components/AdminLayout';
import GameEditor from '../../../components/GameEditor';

export default function EditGamePage() {
  return (
    <AdminLayout>
      <h2 className="text-xl font-semibold mb-4">Edit Game</h2>
      <GameEditor />
    </AdminLayout>
  );
}
