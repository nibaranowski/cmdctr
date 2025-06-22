import Head from 'next/head'
import React from 'react'
import { 
  PersonIcon,
  BackpackIcon,
  BarChartIcon,
  RocketIcon,
  SpeakerLoudIcon,
  GearIcon
} from '@radix-ui/react-icons';

import AppLayout from '../components/layout/AppLayout'
import MetaBoxCard from '../components/MetaBoxCard'

export default function Dashboard() {
  const metaBoxes = [
    {
      id: "hiring",
      icon: PersonIcon,
      title: "Hiring",
      description: "AI-powered candidate sourcing and screening",
      stats: { active: 12, completed: 8 }
    },
    {
      id: "selling",
      icon: BackpackIcon,
      title: "Selling",
      description: "Lead qualification and sales automation",
      stats: { active: 24, completed: 15 }
    },
    {
      id: "fundraising",
      icon: BarChartIcon,
      title: "Fundraising",
      description: "Investor pipeline and deal tracking",
      stats: { active: 8, completed: 3 }
    },
    {
      id: "product",
      icon: RocketIcon,
      title: "Product",
      description: "Feature prioritization and roadmap",
      stats: { active: 18, completed: 12 }
    },
    {
      id: "marketing",
      icon: SpeakerLoudIcon,
      title: "Marketing",
      description: "Campaign orchestration and analytics",
      stats: { active: 6, completed: 4 }
    },
    {
      id: "operations",
      icon: GearIcon,
      title: "Operations",
      description: "Process automation and optimization",
      stats: { active: 10, completed: 7 }
    }
  ];

  return (
    <>
      <Head>
        <title>Dashboard - Command Center</title>
        <meta name="description" content="Manage your business operations with AI-powered tools" />
      </Head>
      <AppLayout>
        <main className="flex-1 bg-white p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {metaBoxes.map((metaBox) => (
                <MetaBoxCard
                  key={metaBox.id}
                  id={metaBox.id}
                  icon={metaBox.icon}
                  title={metaBox.title}
                  description={metaBox.description}
                  stats={metaBox.stats}
                  href={`/${metaBox.id}`}
                />
              ))}
            </div>
          </div>
        </main>
      </AppLayout>
    </>
  );
} 