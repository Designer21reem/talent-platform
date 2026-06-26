'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ClipboardCheck, Phone, CheckCircle2, AlertTriangle, ChevronLeft, ChevronRight, Send,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { QuestionCard } from '@/components/assessment/QuestionCard';
import { ASSESSMENT_QUESTIONS } from '@/lib/assessmentQuestions';
import { saveAssessment, loadCV } from '@/lib/storage';

export default function AssessmentPage() {
  const router = useRouter();
  const [pageState, setPageState] = useState('gate');
  const [phoneInput, setPhoneInput] = useState('');
  const [phoneError, setPhoneError] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [candidateName, setCandidateName] = useState('');
  const [resolvedPhone, setResolvedPhone] = useState('');
  const [cvPhone, setCvPhone] = useState(null);

  console.log('[AssessmentPage] Rendered — state:', pageState, '| question:', currentQ);

  useEffect(() => {
    const cv = loadCV();
    if (cv) {
      const phone = cv.personalInfo.phone || '';
      setCandidateName(cv.personalInfo.fullName);
      if (phone) {
        setCvPhone(phone);
        setResolvedPhone(phone);
      }
      console.log('[AssessmentPage] CV loaded — name:', cv.personalInfo.fullName, '| phone:', phone || '(none)');
    }
  }, []);

  function startAssessment() {
    console.log('[AssessmentPage] Attempting to start assessment…');

    if (cvPhone) {
      console.log('[AssessmentPage] Using phone from CV:', cvPhone);
      setPageState('assessment');
      return;
    }

    if (!phoneInput.trim()) {
      console.warn('[AssessmentPage] Phone number missing — blocking start');
      setPhoneError('Phone number is required to start the assessment.');
      return;
    }

    console.log('[AssessmentPage] Using manually entered phone:', phoneInput);
    setResolvedPhone(phoneInput.trim());
    setPhoneError(null);
    setPageState('assessment');
  }

  function setAnswer(questionId, value) {
    console.log('[AssessmentPage] Answer set — questionId:', questionId, '| value:', value);
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setSubmitError(null);
  }

  function goNext() {
    const current = ASSESSMENT_QUESTIONS[currentQ];
    if (!answers[current.id]?.trim()) {
      console.warn('[AssessmentPage] Cannot proceed — Q', currentQ + 1, 'not answered');
      setSubmitError('Please answer this question before moving on.');
      return;
    }
    setSubmitError(null);
    if (currentQ < ASSESSMENT_QUESTIONS.length - 1) {
      console.log('[AssessmentPage] Moving to question', currentQ + 2);
      setCurrentQ((q) => q + 1);
    }
  }

  function goBack() {
    if (currentQ > 0) {
      console.log('[AssessmentPage] Going back to question', currentQ);
      setSubmitError(null);
      setCurrentQ((q) => q - 1);
    }
  }

  function handleSubmit() {
    const unanswered = ASSESSMENT_QUESTIONS.filter((q) => !answers[q.id]?.trim());

    if (unanswered.length > 0) {
      const msg = `Please answer all questions before submitting. Missing: Q${unanswered.map((q) => ASSESSMENT_QUESTIONS.indexOf(q) + 1).join(', ')}.`;
      console.warn('[AssessmentPage] Submit blocked —', msg);
      setSubmitError(msg);
      return;
    }

    const assessmentAnswers = ASSESSMENT_QUESTIONS.map((q) => ({
      questionId: q.id,
      answer: answers[q.id],
      category: q.category,
    }));

    const data = {
      answers: assessmentAnswers,
      submittedAt: new Date().toISOString(),
      candidateName,
      candidatePhone: resolvedPhone,
    };

    console.log('[AssessmentPage] Submitting assessment:', data);
    saveAssessment(data);
    setSubmitError(null);
    setPageState('submitted');
  }

  const progress = ((currentQ + 1) / ASSESSMENT_QUESTIONS.length) * 100;

  // ── Phone Gate ────────────────────────────────────────────────────────────

  if (pageState === 'gate') {
    return (
      <div className="py-12 sm:py-20">
        <Container maxWidth="sm">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand mb-4">
              <ClipboardCheck size={26} className="text-dark" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Skill Assessment</h1>
            <p className="text-silver text-lg">
              This optional assessment evaluates your key professional skills.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-surface rounded-2xl border border-surface-2 shadow-sm p-6 sm:p-8"
          >
            {cvPhone ? (
              <div className="flex items-center gap-3 mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-emerald-800">Phone number found</p>
                  <p className="text-xs text-emerald-600 mt-0.5">{cvPhone} — ready to start!</p>
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <Input
                  label="Your Phone Number"
                  type="tel"
                  placeholder="+1 555 000 0000"
                  value={phoneInput}
                  onChange={(e) => {
                    setPhoneInput(e.target.value);
                    setPhoneError(null);
                    console.log('[AssessmentPage] Phone input changed:', e.target.value);
                  }}
                  error={phoneError ?? undefined}
                  leftElement={<Phone size={15} />}
                  required
                  hint="Required to identify your results in the dashboard."
                />
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-silver mb-6">
              <span>{ASSESSMENT_QUESTIONS.length} questions</span>
              <span>~10 minutes</span>
            </div>

            <Button fullWidth size="lg" onClick={startAssessment} rightIcon={<ChevronRight size={18} />}>
              Start Assessment
            </Button>
          </motion.div>
        </Container>
      </div>
    );
  }

  // ── Submitted ─────────────────────────────────────────────────────────────

  if (pageState === 'submitted') {
    return (
      <div className="py-12 sm:py-20">
        <Container maxWidth="sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
              className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 size={36} className="text-emerald-500" />
            </motion.div>

            <h2 className="text-3xl font-bold text-white mb-3">Assessment Submitted!</h2>
            <p className="text-silver text-lg mb-8">
              Thank you{candidateName ? `, ${candidateName.split(' ')[0]}` : ''}! Your responses have been
              saved. Head to your dashboard to see your personalised skills report.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" onClick={() => router.push('/dashboard')}>
                View My Dashboard
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => {
                  setAnswers({});
                  setCurrentQ(0);
                  setPageState('gate');
                }}
              >
                Retake Assessment
              </Button>
            </div>
          </motion.div>
        </Container>
      </div>
    );
  }

  // ── Assessment ────────────────────────────────────────────────────────────

  const currentQuestion = ASSESSMENT_QUESTIONS[currentQ];

  return (
    <div className="py-12 sm:py-16">
      <Container maxWidth="md">
        {/* Progress header */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-silver mb-2">
            <span>Question {currentQ + 1} of {ASSESSMENT_QUESTIONS.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <ProgressBar value={progress} showValue={false} size="sm" />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            answer={answers[currentQuestion.id] ?? ''}
            questionIndex={currentQ}
            total={ASSESSMENT_QUESTIONS.length}
            onChange={(v) => setAnswer(currentQuestion.id, v)}
          />
        </AnimatePresence>

        {/* Submit error */}
        {submitError && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3"
          >
            {submitError}
          </motion.p>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            disabled={currentQ === 0}
            leftIcon={<ChevronLeft size={16} />}
          >
            Back
          </Button>

          {currentQ < ASSESSMENT_QUESTIONS.length - 1 ? (
            <Button size="sm" onClick={goNext} rightIcon={<ChevronRight size={16} />}>
              Next
            </Button>
          ) : (
            <Button size="sm" onClick={handleSubmit} rightIcon={<Send size={15} />}>
              Submit Assessment
            </Button>
          )}
        </div>

        {/* Answer dots */}
        <div className="flex justify-center gap-1.5 mt-6">
          {ASSESSMENT_QUESTIONS.map((q, i) => {
            const isAnswered = !!answers[q.id]?.trim();
            const canNavigate = i <= currentQ || isAnswered;
            return (
              <button
                key={q.id}
                onClick={() => {
                  if (!canNavigate) return;
                  setSubmitError(null);
                  setCurrentQ(i);
                }}
                disabled={!canNavigate}
                className={`h-2 rounded-full transition-all ${
                  i === currentQ
                    ? 'bg-brand w-4'
                    : isAnswered
                    ? 'bg-emerald-400 w-2 cursor-pointer'
                    : 'bg-slate-200 w-2 cursor-not-allowed opacity-50'
                }`}
              />
            );
          })}
        </div>
      </Container>
    </div>
  );
}
