import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertOctagon, ArrowRight, DollarSign, Clock, ShieldCheck, Check } from 'lucide-react';
import { approveDecision, reviewDecision } from '../services/flightApi';

/**
 * AIRecommendation Component
 * 
 * Operational mitigation cockpit presenting AI-generated recovery strategies.
 * Provides Human-in-the-Loop decision execution (Approve or Escalate/Review)
 * with direct audit trail logging.
 */
export const AIRecommendation = ({
  flight,
  onActionComplete
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const recommendation = flight?.recommendation;
  const flightNumber = flight?.flightNumber;

  if (!recommendation) {
    return (
      <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 text-center text-slate-400 text-xs">
        No active AI mitigation recommendation generated for this flight.
      </div>
    );
  }

  const handleApprove = async () => {
    if (!flightNumber || isSubmitting) return;
    setIsSubmitting(true);
    setFeedbackMessage(null);

    try {
      const response = await approveDecision(flightNumber, 'Ops Dispatcher #402');
      setFeedbackMessage({ type: 'success', text: response.message || 'Decision approved successfully.' });
      if (onActionComplete) onActionComplete(response);
    } catch (err) {
      setFeedbackMessage({ type: 'error', text: 'Failed to approve decision. Try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReview = async () => {
    if (!flightNumber || isSubmitting) return;
    setIsSubmitting(true);
    setFeedbackMessage(null);

    try {
      const response = await reviewDecision(flightNumber, 'Senior Duty Supervisor');
      setFeedbackMessage({ type: 'warning', text: response.message || 'Review requested.' });
      if (onActionComplete) onActionComplete(response);
    } catch (err) {
      setFeedbackMessage({ type: 'error', text: 'Failed to request review. Try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isApproved = recommendation.status === 'APPROVED';
  const isReviewRequested = recommendation.status === 'REVIEW_REQUESTED';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4 relative overflow-hidden">
      {/* Background glow banner */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Autonomous Mitigation Strategy
              </h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-semibold">
                Confidence: {recommendation.confidenceScore}%
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Synthesized by Fleet Optimization Agent
            </p>
          </div>
        </div>

        {/* Current Approval Status Badge */}
        <div>
          {isApproved ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <Check className="w-3.5 h-3.5" />
              Approved
            </span>
          ) : isReviewRequested ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <Clock className="w-3.5 h-3.5" />
              Under Review
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40">
              Pending Authorization
            </span>
          )}
        </div>
      </div>

      {/* Action Title Card */}
      <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
        <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold mb-1">
          {recommendation.action?.replace(/_/g, ' ')}
        </div>
        <h4 className="text-base font-bold text-white leading-snug">
          {recommendation.title}
        </h4>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
          {recommendation.reasoning}
        </p>
      </div>

      {/* Expected Operational Savings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/40 flex items-center gap-3">
          <div className="p-2 rounded bg-emerald-500/10 text-emerald-400">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-emerald-300 uppercase tracking-wider font-semibold">
              Projected ROI & Savings
            </div>
            <div className="text-sm font-bold font-mono text-emerald-400">
              {recommendation.estimatedSavings}
            </div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded bg-slate-800 text-cyan-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Regulatory Safeguard
            </div>
            <div className="text-sm font-medium text-slate-200">
              Eliminates FAR 117 Crew Violation
            </div>
          </div>
        </div>
      </div>

      {/* Alternative Trade-offs Evaluated */}
      {recommendation.alternativeActions?.length > 0 && (
        <div className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-800/60">
          <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Alternative Scenarios Evaluated & Rejected:
          </h5>
          <ul className="space-y-1.5 text-xs text-slate-400">
            {recommendation.alternativeActions.map((alt, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-slate-600 mt-1 font-mono">&bull;</span>
                <span>{alt}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Audit Confirmation Stamp */}
      {(recommendation.approvedBy || recommendation.reviewedBy) && (
        <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/50 text-xs text-slate-300 flex items-center justify-between">
          <span className="font-mono">
            {recommendation.approvedBy
              ? `Authorized by: ${recommendation.approvedBy}`
              : `Review requested by: ${recommendation.reviewedBy}`}
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            {new Date(recommendation.timestamp).toLocaleTimeString()}
          </span>
        </div>
      )}

      {/* Inline Feedback Toast */}
      {feedbackMessage && (
        <div className={`p-2.5 rounded-lg text-xs font-medium border ${
          feedbackMessage.type === 'success'
            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
            : feedbackMessage.type === 'warning'
            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
            : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
        }`}>
          {feedbackMessage.text}
        </div>
      )}

      {/* Action Buttons (Human In The Loop) */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          onClick={handleApprove}
          disabled={isSubmitting || isApproved}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-md ${
            isApproved
              ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 cursor-not-allowed'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isApproved ? 'Decision Enacted' : isSubmitting ? 'Transmitting...' : 'Approve Decision'}</span>
        </button>

        <button
          onClick={handleReview}
          disabled={isSubmitting || isApproved}
          className={`px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border ${
            isReviewRequested
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 hover:text-white'
          }`}
        >
          <AlertOctagon className="w-4 h-4 inline-block mr-1.5" />
          <span>{isReviewRequested ? 'In Escrow' : 'Request Review'}</span>
        </button>
      </div>
    </div>
  );
};

export default AIRecommendation;
