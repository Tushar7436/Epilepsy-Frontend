import DashboardLayout from "../../components/DashboardLayout"

export default function DashboardPage({ params }) {
  const { role } = params

  // Validate role
  const validRoles = ["patient", "doctor", "community"]
  if (!validRoles.includes(role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Invalid Role</h1>
          <p className="text-gray-600">Please use a valid role: patient, doctor, or community</p>
        </div>
      </div>
    )
  }

  return <DashboardLayout role={role} />
}

export function generateStaticParams() {
  return [{ role: "patient" }, { role: "doctor" }, { role: "community" }]
}
