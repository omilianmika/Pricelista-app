import React from 'react';

interface PackageFeature {
  title: string;
  items: string[];
}

const packages: PackageFeature[] = [
  {
    title: 'Bas',
    items: [
      'Chat',
      'Nyhetsflöde',
      'Digital anslagstavla',
      'Filhantering'
    ]
  },
  {
    title: 'Learn & Grow',
    items: [
      'Mikroutbildningar',
      'Onboarding',
      'Test- och kunskapsprov',
      'Feedback',
      'Puls',
      'Enkäter'
    ]
  },
  {
    title: 'Tools',
    items: [
      'Ärendehantering',
      'Checklistor'
    ]
  }
];

export function PackageInfo() {
  return (
    <div className="package-info-container">
      <div className="package-grid">
        {packages.map((pkg) => (
          <div key={pkg.title} className="package-box">
            <h3 className="package-title">{pkg.title}</h3>
            <ul className="package-features">
              {pkg.items.map((item) => (
                <li key={item} className="package-feature">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
} 