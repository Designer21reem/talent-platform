'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ClipboardCheck, Phone, CheckCircle2, AlertTriangle, ChevronLeft, ChevronRight, Send, Zap,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { HeroBackground } from '@/components/layout/HeroBackground';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { QuestionCard } from '@/components/assessment/QuestionCard';
import { ASSESSMENT_QUESTIONS } from '@/lib/assessmentQuestions';
import { computeStyleResult, STYLE_INFO } from '@/lib/styleAssessment';
import { saveAssessment, loadCV } from '@/lib/storage';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { requestUploadUrl, uploadToS3 } from '@/lib/api';

export default function AssessmentPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { user, token } = useAuth();
  const [pageState, setPageState] = useState('gate');
  const [phoneInput, setPhoneInput] = useState('');
  const [phoneError, setPhoneError] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [resolvedPhone, setResolvedPhone] = useState('');
  const [cvPhone, setCvPhone] = useState(null);
  const [styleResult, setStyleResult] = useState(null);


  useEffect(() => {
    const cv = loadCV();
    if (cv) {
      const phone = cv.personalInfo.phone || '';
      setCandidateName(cv.personalInfo.fullName);
      setCandidateEmail(cv.personalInfo.email || user?.email || '');
      if (phone) {
        setCvPhone(phone);
        setResolvedPhone(phone);
      }
    } else if (user?.email) {
      setCandidateEmail(user.email);
    }
  }, [user]);

  function startAssessment() {

    if (cvPhone) {
      setPageState('assessment');
      return;
    }

    if (!phoneInput.trim()) {
      setPhoneError(t('Phone number is required to start the assessment.'));
      return;
    }

    setResolvedPhone(phoneInput.trim());
    setPhoneError(null);
    setPageState('assessment');
  }

  function setAnswer(questionId, value) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setSubmitError(null);
  }

  function goNext() {
    const current = ASSESSMENT_QUESTIONS[currentQ];
    if (!answers[current.id]?.trim()) {
      setSubmitError(t('Please answer this question before moving on.'));
      return;
    }
    setSubmitError(null);
    if (currentQ < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQ((q) => q + 1);
    }
  }

  function goBack() {
    if (currentQ > 0) {
      setSubmitError(null);
      setCurrentQ((q) => q - 1);
    }
  }

  async function handleSubmit() {
    const unanswered = ASSESSMENT_QUESTIONS.filter((q) => !answers[q.id]?.trim());

    if (unanswered.length > 0) {
      const msg = `${t('Please answer all questions before submitting. Missing:')} Q${unanswered.map((q) => ASSESSMENT_QUESTIONS.indexOf(q) + 1).join(', ')}.`;
      setSubmitError(msg);
      return;
    }

    if (!token) {
      setSubmitError(t('You must be signed in with Google to submit the assessment.'));
      return;
    }

    const assessmentAnswers = ASSESSMENT_QUESTIONS.map((q) => ({
      questionId: q.id,
      answer: answers[q.id],
      category: q.category,
    }));

    const result = computeStyleResult(answers);

    const data = {
      answers: assessmentAnswers,
      styleResult: result,
      submittedAt: new Date().toISOString(),
      candidateName,
      candidateEmail,
      candidatePhone: resolvedPhone,
    };

    setSubmitting(true);
    setSubmitError(null);

    try {
      const fileName = 'assessment.json';
      const jsonBody = JSON.stringify(data);
      const urlData = await requestUploadUrl(token, {
        fileName,
        fileType: 'application/json',
        fileSize: new Blob([jsonBody]).size,
        frontendSelection: 'assessment_json',
      });

      // Every JSON upload must carry the user_id/email the backend resolved
      // for this presigned URL, so the assessment record can be matched to
      // the candidate once it's picked up from the S3 data lake.
      const payload = { ...data, user_id: urlData.user_id, email: urlData.user_email };
      await uploadToS3(urlData.upload_url, JSON.stringify(payload), 'application/json', urlData);

      saveAssessment(data);
      setStyleResult(result);
      setPageState('submitted');
    } catch (err) {
      console.error('[Assessment] Submission failed:', err);
      setSubmitError(err.message || t('Something went wrong submitting your assessment. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  const progress = ((currentQ + 1) / ASSESSMENT_QUESTIONS.length) * 100;

  // ── Phone Gate ────────────────────────────────────────────────────────────

  if (pageState === 'gate') {
    return (
      <div className="overflow-x-hidden">
        <section className="relative bg-dark pt-14 pb-16 sm:pt-16 sm:pb-20 overflow-hidden">
          <HeroBackground variant="waves" />
          <Container maxWidth="sm">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10 text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand mb-4">
                <ClipboardCheck size={26} className="text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{t('Skill Assessment')}</h1>
              <p className="text-silver text-lg">
                {t('This optional assessment evaluates your key professional skills.')}
              </p>
            </motion.div>
          </Container>
        </section>

        <div className="py-12 sm:py-16">
        <Container maxWidth="sm">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="flex items-start gap-3 mb-6 p-4 rounded-xl border border-brand/30 bg-brand/10"
          >
            <Zap size={18} className="text-brand shrink-0 mt-0.5" />
            <p className="text-sm text-warm leading-relaxed">
              {t('Candidates who complete this assessment stand out to employers and get matched with job opportunities faster. It only takes about 10 minutes — a small step that can make a big difference in how quickly you land your next role.')}
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
                  <p className="text-sm font-medium text-emerald-800">{t('Phone number found')}</p>
                  <p className="text-xs text-emerald-600 mt-0.5">
                    <span dir="ltr" className="inline-block">{cvPhone}</span> — {t('ready to start!')}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <Input
                  label={t('Your Phone Number')}
                  type="tel"
                  placeholder="+1 555 000 0000"
                  value={phoneInput}
                  onChange={(e) => {
                    setPhoneInput(e.target.value);
                    setPhoneError(null);
                  }}
                  error={phoneError ?? undefined}
                  leftElement={<Phone size={15} />}
                  required
                  hint={t('Required to identify your results in the dashboard.')}
                />
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-silver mb-6">
              <span>{ASSESSMENT_QUESTIONS.length} {t('questions')}</span>
              <span>{t('~10 minutes')}</span>
            </div>

            <Button fullWidth size="lg" onClick={startAssessment} rightIcon={<ChevronRight size={18} className="rtl:-scale-x-100" />}>
              {t('Start Assessment')}
            </Button>
          </motion.div>
        </Container>
        </div>
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

            <h2 className="text-3xl font-bold text-white mb-3">{t('Assessment Submitted!')}</h2>
            <p className="text-silver text-lg mb-8">
              {t('Thank you')}{candidateName ? `, ${candidateName.split(' ')[0]}` : ''}! {t('Your responses have been saved. Head to your dashboard to see your personalised skills report.')}
            </p>

            {styleResult && (
              <div className="bg-surface rounded-2xl border border-surface-2 shadow-sm p-6 sm:p-8 mb-8 text-start">
                <p className="text-xs font-semibold text-brand uppercase tracking-wide mb-1">
                  {t('Your Personal Style')}
                </p>
                <h3 className="text-2xl font-bold text-white mb-1">
                  {STYLE_INFO[styleResult.predominant].name} — {t(STYLE_INFO[styleResult.predominant].title)}
                </h3>
                <p className="text-sm text-silver mb-4">
                  {t('Backup style')}: {STYLE_INFO[styleResult.backup].name} — {t(STYLE_INFO[styleResult.backup].title)}
                </p>
                <div className="space-y-2 mb-4">
                  {styleResult.ranked.map((key) => (
                    <div key={key} className="flex items-center gap-3">
                      <span className="w-20 shrink-0 text-xs font-medium text-warm">{STYLE_INFO[key].name}</span>
                      <div className="flex-1 h-2 rounded-full bg-surface-2 overflow-hidden">
                        <div
                          className="h-full bg-brand rounded-full"
                          style={{ width: `${(styleResult.counts[key] / (styleResult.total || 1)) * 100}%` }}
                        />
                      </div>
                      <span className="w-6 shrink-0 text-xs text-silver text-end">{styleResult.counts[key]}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-silver leading-relaxed">
                  {STYLE_INFO[styleResult.predominant].traits.slice(0, 6).join(', ')}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" onClick={() => router.push('/dashboard')}>
                {t('View My Dashboard')}
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => {
                  setAnswers({});
                  setCurrentQ(0);
                  setStyleResult(null);
                  setPageState('gate');
                }}
              >
                {t('Retake Assessment')}
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
            <span>{t('Question')} {currentQ + 1} {t('of')} {ASSESSMENT_QUESTIONS.length}</span>
            <span>{Math.round(progress)}% {t('complete')}</span>
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
            leftIcon={<ChevronLeft size={16} className="rtl:-scale-x-100" />}
          >
            {t('Back')}
          </Button>

          {currentQ < ASSESSMENT_QUESTIONS.length - 1 ? (
            <Button size="sm" onClick={goNext} rightIcon={<ChevronRight size={16} className="rtl:-scale-x-100" />}>
              {t('Next')}
            </Button>
          ) : (
            <Button size="sm" onClick={handleSubmit} disabled={submitting} rightIcon={<Send size={15} />}>
              {submitting ? t('Submitting…') : t('Submit Assessment')}
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
