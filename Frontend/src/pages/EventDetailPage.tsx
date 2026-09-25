import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { publicApi } from "../lib/api";
import PageWrapper from "../components/PageWrapper";
import {
  Zap,
  IndianRupee,
  Trophy,
  Users,
  Layers,
  ArrowLeft,
  ChevronRight,
  Shield,
  Bot,
  CheckCircle2,
  Calendar,
  MapPin,
  Flame,
} from "lucide-react";

export default function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    publicApi
      .getEventBySlug(slug)
      .then((res) => setEvent(res.data))
      .catch(() => {
        publicApi.getEvents().then((r) => {
          const found = r.data.find((e: any) => e.slug === slug);
          setEvent(found || null);
        });
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <PageWrapper>
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </PageWrapper>
    );
  }

  if (!event) {
    return (
      <PageWrapper>
        <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 text-center">
          <h2 className="font-orbitron font-bold text-3xl text-white mb-4">Event Not Found</h2>
          <p className="text-slate-400 text-sm font-space mb-8">
            The competition you are looking for does not exist or has been modified.
          </p>
          <Link to="/events" className="btn-primary text-xs py-3 px-6">
            <span>← BACK TO ALL EVENTS</span>
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-8">
        {/* Back navigation */}
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-xs font-space font-semibold text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO ALL COMPETITIONS</span>
        </Link>

        {/* Main Event Header Card */}
        <div className="glass p-6 sm:p-10 rounded-3xl border-cyan-500/30 shadow-2xl relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <span className="px-3.5 py-1 rounded-full text-xs font-orbitron font-bold bg-cyan-950/80 border border-cyan-400/40 text-cyan-300">
              {event.category?.toUpperCase()} TRACK
            </span>

            <span className="text-xs font-mono-matrix text-slate-400">
              EVENT ID: #{event.slug?.toUpperCase()}
            </span>
          </div>

          <h1 className="font-orbitron font-black text-3xl sm:text-5xl text-white mb-4">
            {event.name}
          </h1>

          <p className="text-slate-300 text-base sm:text-lg font-body leading-relaxed mb-8">
            {event.longDescription || event.description}
          </p>

          {/* Key Metric Specs */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-slate-800">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="font-orbitron font-black text-xl sm:text-2xl text-emerald-400">
                ₹{event.fee}
              </div>
              <div className="text-xs font-space text-slate-400 mt-0.5">Registration Fee</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="font-orbitron font-black text-xl sm:text-2xl text-amber-400">
                {event.prize}
              </div>
              <div className="text-xs font-space text-slate-400 mt-0.5">Bounty Prize</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="font-orbitron font-black text-xl sm:text-2xl text-cyan-400">
                {event.teamType === "individual"
                  ? "Solo"
                  : event.minTeam === event.maxTeam
                  ? `${event.minTeam} Players`
                  : `${event.minTeam}–${event.maxTeam} P`}
              </div>
              <div className="text-xs font-space text-slate-400 mt-0.5">Team Size</div>
            </div>
          </div>
        </div>

        {/* Rounds Breakdown */}
        {event.rounds && event.rounds.length > 0 && (
          <div className="glass p-6 sm:p-10 rounded-3xl border-cyan-500/20 shadow-xl">
            <h3 className="font-orbitron font-bold text-xl text-white mb-6 flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>ROUND-BY-ROUND FORMAT ({event.rounds.length} ROUNDS)</span>
            </h3>

            <div className="space-y-4">
              {event.rounds.map((round: any, idx: number) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex gap-4 items-start"
                >
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-orbitron font-black text-sm flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-orbitron font-bold text-base text-white mb-1">
                      {round.name}
                    </h4>
                    <p className="text-slate-300 text-sm font-body leading-relaxed">
                      {round.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Venue & Date Info */}
        <div className="glass p-6 sm:p-8 rounded-3xl border-cyan-500/20 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-cyan-400 flex-shrink-0" />
            <div>
              <div className="text-xs font-space text-slate-400">Date & Schedule</div>
              <div className="font-orbitron font-bold text-sm text-white">27–28 October 2026</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0" />
            <div>
              <div className="text-xs font-space text-slate-400">Venue Location</div>
              <div className="font-orbitron font-bold text-sm text-white">Geeta University Campus</div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="glass p-6 rounded-3xl border-cyan-400/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-orbitron font-bold text-lg text-white">Ready To Compete?</div>
            <div className="text-xs font-space text-slate-400">
              Instant spot booking with UPI payment verification
            </div>
          </div>

          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent("eventSelected", { detail: event.name }));
              navigate("/register");
            }}
            className="btn-primary text-xs py-3.5 px-8 shadow-cyan-500/30 flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <span>REGISTER FOR THIS EVENT</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}
