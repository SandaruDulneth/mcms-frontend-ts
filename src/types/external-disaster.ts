export type ExternalDisasterSource = "NewsAPI" | "GDACS";

export type ExternalDisasterItem = {
  id: string;
  source: ExternalDisasterSource;
  title: string;
  disasterType: string;
  location: string;
  description: string;
  url: string;
  publishedAt: string;
  sourceName: string;
  status: string;
};

export type ExternalDisasterFeed = {
  fetchedAt: string;
  country: "Sri Lanka";
  items: ExternalDisasterItem[];
  sources: {
    newsApi: {
      enabled: boolean;
      itemCount: number;
      error: string;
    };
    gdacs: {
      enabled: boolean;
      itemCount: number;
      error: string;
    };
  };
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
};

