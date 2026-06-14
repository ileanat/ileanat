export type LocationResult = {
  id: string;
  name: string;
  address?: string;
  lat: number;
  lng: number;
  category?: string;
};

export const BROOKLYN_COLLEGE = { lat: 40.6311, lng: -73.9524 };

export const BROOKLYN_COLLEGE_PLACE: LocationResult = {
  id: "brooklyn-college",
  name: "CUNY Brooklyn College",
  address: "2900 Bedford Ave, Brooklyn, NY 11210",
  lat: BROOKLYN_COLLEGE.lat,
  lng: BROOKLYN_COLLEGE.lng,
  category: "university",
};

export const BROOKLYN_COLLEGE_SEARCH_RADIUS = 8000;

function formatPlaceCategory(types?: string[]) {
  if (!types?.length) return undefined;

  return types[0]
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function searchPlacesNearBrooklynCollege(
  query: string,
  map: google.maps.Map,
): Promise<LocationResult[]> {
  return new Promise((resolve, reject) => {
    const service = new google.maps.places.PlacesService(map);

    service.textSearch(
      {
        query,
        location: new google.maps.LatLng(
          BROOKLYN_COLLEGE.lat,
          BROOKLYN_COLLEGE.lng,
        ),
        radius: BROOKLYN_COLLEGE_SEARCH_RADIUS,
      },
      (places, status) => {
        if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          resolve([]);
          return;
        }

        if (
          status !== google.maps.places.PlacesServiceStatus.OK ||
          !places
        ) {
          reject(new Error("Unable to search locations. Please try again."));
          return;
        }

        resolve(
          places
            .filter(
              (place) =>
                place.place_id &&
                place.geometry?.location &&
                place.name,
            )
            .map((place) => ({
              id: place.place_id!,
              name: place.name!,
              address: place.formatted_address,
              lat: place.geometry!.location!.lat(),
              lng: place.geometry!.location!.lng(),
              category: formatPlaceCategory(place.types),
            })),
        );
      },
    );
  });
}
