import MapPlaceholder from "@/components/MapPlaceholder";
import { mockDisasters } from "@/data/mockDisasters";

export default function MapPage() {
  return (
    <main className="space-y-6 px-5 py-6 md:px-8">
      <section>
        <h2 className="text-2xl font-bold text-slate-950">Crisis Map</h2>
        <p className="mt-1 text-sm text-slate-600">
          Prototype map view showing mock incidents and urgency-coded pins.
        </p>
      </section>
      <MapPlaceholder reports={mockDisasters} />
    </main>
  );
}
