import { useOrganization } from '../hooks/useOrganization';

export default function OrganizationSelector() {
  const { currentOrg, setCurrentOrg, organizations } = useOrganization();

  if (organizations.length <= 1) return null;

  return (
    <div className="mb-4">
      <select
        value={currentOrg?.id || ''}
        onChange={(e) => {
          const org = organizations.find(o => o.id === e.target.value);
          if (org) setCurrentOrg(org);
        }}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {organizations.map((org) => (
          <option key={org.id} value={org.id}>{org.name}</option>
        ))}
      </select>
    </div>
  );
}