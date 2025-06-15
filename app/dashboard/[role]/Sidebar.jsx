'use client';

export default function Sidebar({ role, onSelectService }) {
  const ashaServices = [
    { name: 'Health Check', key: 'health' },
    { name: 'Family Records', key: 'family' },
  ];

  const doctorServices = [
    { name: 'Patient List', key: 'patients' },
    { name: 'Appointments', key: 'appointments' },
  ];

  const adminServices = [
    { name: 'User Management', key: 'users' },
    { name: 'Reports', key: 'reports' },
  ];

  const servicesMap = {
    asha: ashaServices,
    doctor: doctorServices,
    admin: adminServices,
  };

  return (
    <aside className="w-64 p-4 bg-gray-100">
      <h2 className="font-bold text-lg mb-4 capitalize">{role} Dashboard</h2>
      <ul className="space-y-2">
        {servicesMap[role]?.map(service => (
          <li key={service.key}>
            <button
              onClick={() => onSelectService(service.key)}
              className="text-left w-full hover:bg-gray-200 p-2 rounded"
            >
              {service.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}