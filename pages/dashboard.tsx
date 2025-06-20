import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

import AppLayout from '../components/layout/AppLayout'
import MetaBoxCard from '../components/MetaBoxCard'

export default function Dashboard() {
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
    <>
      <Head>
        <title>Activities - Command Center</title>
      </Head>
      <AppLayout>
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Activities</h2>
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
              <MetaBoxCard
                key={metaBox.id}
                id={metaBox.id}
                icon={metaBox.icon}
                title={metaBox.title}
                description={metaBox.description}
                color={metaBox.color}
                stats={metaBox.stats}
                href={`/${metaBox.id}`}
              />
            ))}
          </div>
        </main>
      </AppLayout>
    </>
  );
} 