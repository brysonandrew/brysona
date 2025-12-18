import type { TBusiness } from '@pages/_dev/outreacher/business-search-panel';

import { useOutreacher } from './context';

type TBusinessSearchResultsProps = {
  businesses: TBusiness[];
  isLoading: boolean;
  statusMessage: string | null;
};

/**
 * Converts Google Places API types to human-readable titles
 */
const formatBusinessType = (type: string): string => {
  const typeMap: Record<string, string> = {
    // Common types
    establishment: 'Business',
    point_of_interest: 'Point of Interest',
    store: 'Store',
    restaurant: 'Restaurant',
    food: 'Food & Dining',
    cafe: 'Cafe',
    bar: 'Bar',
    night_club: 'Night Club',
    lodging: 'Lodging',
    hotel: 'Hotel',
    gas_station: 'Gas Station',
    bank: 'Bank',
    atm: 'ATM',
    pharmacy: 'Pharmacy',
    hospital: 'Hospital',
    doctor: 'Doctor',
    dentist: 'Dentist',
    school: 'School',
    university: 'University',
    gym: 'Gym',
    spa: 'Spa',
    beauty_salon: 'Beauty Salon',
    hair_care: 'Hair Care',
    car_repair: 'Car Repair',
    car_dealer: 'Car Dealer',
    real_estate_agency: 'Real Estate',
    law_firm: 'Law Firm',
    accounting: 'Accounting',
    insurance_agency: 'Insurance',
    moving_company: 'Moving Company',
    plumber: 'Plumber',
    electrician: 'Electrician',
    general_contractor: 'Contractor',
    home_goods_store: 'Home Goods',
    furniture_store: 'Furniture Store',
    clothing_store: 'Clothing Store',
    shoe_store: 'Shoe Store',
    jewelry_store: 'Jewelry Store',
    book_store: 'Book Store',
    electronics_store: 'Electronics Store',
    supermarket: 'Supermarket',
    grocery_or_supermarket: 'Grocery Store',
    convenience_store: 'Convenience Store',
    bakery: 'Bakery',
    meal_takeaway: 'Takeaway',
    meal_delivery: 'Food Delivery',
    // Professional services
    lawyer: 'Lawyer',
    accountant: 'Accountant',
    architect: 'Architect',
    // Entertainment
    movie_theater: 'Movie Theater',
    museum: 'Museum',
    art_gallery: 'Art Gallery',
    park: 'Park',
    zoo: 'Zoo',
    // Transportation
    airport: 'Airport',
    train_station: 'Train Station',
    bus_station: 'Bus Station',
    subway_station: 'Subway Station',
    // Other
    post_office: 'Post Office',
    library: 'Library',
    church: 'Church',
    mosque: 'Mosque',
    synagogue: 'Synagogue',
    cemetery: 'Cemetery',
    // Default fallback
  };

  // If exact match exists, return it
  if (typeMap[type]) {
    return typeMap[type];
  }

  // Convert snake_case or kebab-case to Title Case
  return type
    .split(/[_-]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const BusinessSearchResults = ({
  businesses,
  isLoading,
  statusMessage,
}: TBusinessSearchResultsProps) => {
  const { setUrl, scrollToUrlInput } = useOutreacher();
  if (isLoading) {
    return (
      <div className="min-h-[1.5rem]">
        <p className="text-white-06 text-xs">
          Searching businesses…
        </p>
      </div>
    );
  }

  if (statusMessage) {
    return (
      <div className="min-h-[1.5rem]">
        <p className="text-white-06 text-xs">
          {statusMessage}
        </p>
      </div>
    );
  }

  if (!businesses.length) {
    return null;
  }

  // Group businesses by type (first rawType) if available, otherwise use "Other"
  const grouped = businesses.reduce<
    Record<string, TBusiness[]>
  >((acc, business) => {
    const rawType = business.rawTypes?.[0] || 'Other';
    const type = rawType === 'Other' ? 'Other' : formatBusinessType(rawType);
    if (!acc[type]) acc[type] = [];
    acc[type].push(business);
    return acc;
  }, {});

  const sortedTypes = Object.keys(grouped).sort(
    (a, b) => a.localeCompare(b),
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 min-h-[1.5rem]">
      {sortedTypes.map((type) => (
        <div
          key={type}
          className="rounded-xl border border-white-02 bg-black-2 px-3 py-2 flex flex-col gap-1.5"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-white-09 font-semibold">
              {type}
            </span>
            <span className="text-[0.65rem] text-white-06">
              {grouped[type].length} business
              {grouped[type].length > 1 ? 'es' : ''}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            {grouped[type]
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((biz) => (
                <div
                  key={biz.id}
                  className="flex items-center justify-between gap-2 rounded-lg bg-black-3 border border-white-02 px-2 py-1"
                >
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs text-white-09 font-medium truncate">
                      {biz.name}
                    </span>
                    {biz.address && (
                      <span className="text-[0.65rem] text-white-06 truncate">
                        {biz.address}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {biz.googleMapsUrl && (
                      <a
                        href={biz.googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[0.65rem] px-2 py-0.5 rounded-lg border border-white-02 bg-black-2 hover:bg-primary-03 hover:text-black transition-colors"
                      >
                        Map
                      </a>
                    )}

                    {biz.website && (
                      <button
                        type="button"
                        onClick={() => {
                          if (biz.website) {
                            setUrl(biz.website);
                            scrollToUrlInput();
                          }
                        }}
                        className="text-[0.65rem] px-2 py-0.5 rounded-lg bg-primary text-black font-semibold hover:bg-primary-08 transition-colors"
                      >
                        Use
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};
