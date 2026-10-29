import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { DirectoryRepository } from '@/lib/data/repository';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { BusinessProfileClient } from '@/components/business/BusinessProfileClient';
import { BusinessCard } from '@/components/business/BusinessCard';
import { ArrowRight } from 'lucide-react';

interface BusinessPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BusinessPageProps): Promise<Metadata> {
  const { slug } = await params;
  const business = await DirectoryRepository.getBusinessBySlug(slug);

  if (!business || business.status !== 'approved') {
    return { title: 'Business Profile Not Found' };
  }

  const locationStr = [business.city?.name, business.region?.name, business.country?.name].filter(Boolean).join(', ');

  return {
    title: `${business.name} - ${business.category?.name} in ${business.city?.name || 'Local City'}, ${business.country?.name}`,
    description: business.short_description || `${business.name} is a verified ${business.category?.name.toLowerCase()} enterprise located in ${locationStr}. Check phone numbers, hours, reviews, and directions.`,
    alternates: {
      canonical: `https://nexusbiz.directory/business/${business.slug}`,
    },
    openGraph: {
      title: `${business.name} | NexusBiz Directory`,
      description: business.short_description || business.description,
      url: `https://nexusbiz.directory/business/${business.slug}`,
      images: business.cover_image_url ? [{ url: business.cover_image_url }] : undefined,
    },
  };
}

export default async function BusinessProfilePage({ params }: BusinessPageProps) {
  const { slug } = await params;
  const business = await DirectoryRepository.getBusinessBySlug(slug);

  if (!business || business.status !== 'approved') {
    notFound();
  }

  const [reviews, related] = await Promise.all([
    DirectoryRepository.getReviews(business.id, 'approved'),
    DirectoryRepository.getRelatedBusinesses(business.id, business.category_id, 3),
  ]);

  // Schema.org LocalBusiness JSON-LD
  const localBusinessJsonLd: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `https://nexusbiz.directory/business/${business.slug}#localbusiness`,
    name: business.name,
    description: business.short_description || business.description,
    url: `https://nexusbiz.directory/business/${business.slug}`,
    telephone: business.phone,
    email: business.email,
    image: business.cover_image_url,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address,
      addressLocality: business.city?.name,
      addressRegion: business.region?.name,
      postalCode: business.postal_code,
      addressCountry: business.country?.code,
    },
  };

  // Only include aggregateRating when genuine reviews exist
  if (business.review_count > 0 && business.rating > 0) {
    localBusinessJsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: business.rating,
      reviewCount: business.review_count,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return (
    <div className="bg-[#F7F9FC] min-h-screen py-8">
      {/* LocalBusiness Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          items={[
            { label: 'Directories', href: '/directories' },
            ...(business.country ? [{ label: business.country.name, href: `/directories/${business.country.slug}` }] : []),
            ...(business.country && business.city ? [{ label: business.city.name, href: `/directories/${business.country.slug}/${business.city.slug}` }] : []),
            { label: business.name },
          ]}
        />

        {/* Client Interactive Profile Component */}
        <div className="mt-4 mb-14">
          <BusinessProfileClient
            business={business}
            reviews={reviews}
          />
        </div>

        {/* Related Businesses Section */}
        {related.length > 0 && (
          <div className="pt-8 border-t border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#172B45]">
                  Related {business.category?.name} Businesses
                </h3>
                <p className="text-xs text-slate-500">
                  Other verified establishments in similar industry sectors.
                </p>
              </div>

              {business.category && (
                <Link
                  href={`/categories/${business.category.slug}`}
                  className="text-xs font-bold text-[#065F46] hover:underline"
                >
                  View more in {business.category.name} &rarr;
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((rel) => (
                <BusinessCard key={rel.id} business={rel} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
