import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

export default function Dashboard() {
  const menuItems = [
    { icon: "🏠", label: "Home", href: "/dashboard", active: true },
    { icon: "👥", label: "Hiring", href: "/hiring" },
    { icon: "🛍️", label: "Selling", href: "/selling" },
    { icon: "💰", label: "Fundraising", href: "/fundraising" },
    { icon: "🚀", label: "Product", href: "/product" },
    { icon: "📢", label: "Marketing", href: "/marketing" },
    { icon: "📊", label: "Reporting", href: "/reporting" },
    { icon: "⚙️", label: "Settings", href: "/settings" }
  ];

  const metaBoxes = [
    {
      id: "hiring",
      icon: "👥",
      title: "Hiring",
      description: "AI-powered candidate sourcing and screening",
      color: "bg-blue-500",
      stats: { active: 12, completed: 8 }
    },
    {
      id: "selling",
      icon: "🛍️",
      title: "Selling",
      description: "Lead qualification and sales automation",
      color: "bg-green-500",
      stats: { active: 24, completed: 15 }
    },
    {
      id: "fundraising",
      icon: "💰",
      title: "Fundraising",
      description: "Investor pipeline and deal tracking",
      color: "bg-purple-500",
      stats: { active: 8, completed: 3 }
    },
    {
      id: "product",
      icon: "🚀",
      title: "Product",
      description: "Feature prioritization and roadmap",
      color: "bg-orange-500",
      stats: { active: 18, completed: 12 }
    },
    {
      id: "marketing",
      icon: "📢",
      title: "Marketing",
      description: "Campaign orchestration and analytics",
      color: "bg-pink-500",
      stats: { active: 6, completed: 4 }
    },
    {
      id: "operations",
      icon: "⚙️",
      title: "Operations",
      description: "Process automation and optimization",
      color: "bg-gray-500",
      stats: { active: 10, completed: 7 }
    }
  ];

  return (
    <div className="h-screen bg-gray-50 flex">
      <Head>
        <title>Dashboard - Command Center</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Command Center</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    item.active
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">John Doe</p>
              <p className="text-xs text-gray-500">john@company.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>
              <p className="text-sm text-gray-600">Manage your business operations</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
              Create Meta Box
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metaBoxes.map((metaBox) => (
              <div key={metaBox.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className={`w-10 h-10 ${metaBox.color} rounded-lg flex items-center justify-center mr-3`}>
                    <span className="text-white text-lg">{metaBox.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{metaBox.title}</h3>
                    <p className="text-sm text-gray-600">{metaBox.description}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{metaBox.stats.active}</span> active
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{metaBox.stats.completed}</span> completed
                  </div>
                </div>
                
                <Link
                  href={`/${metaBox.id}`}
                  className="block w-full bg-gray-50 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors text-center"
                >
                  Open Workspace
                </Link>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
} 