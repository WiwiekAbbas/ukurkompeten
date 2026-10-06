'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'

export default function AssessmentPage() {
  const params = useParams()
  const router = useRouter()
  const [assessment, setAssessment] = useState<any>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    // Start assessment when page loads
    const startAssessment = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/assessments/start`,
          { module_id: params.moduleId }
        )
        setAssessment(response.data)
        setAnswers(new Array(response.data.total_items).fill(''))
      } catch (error) {
        console.error('Failed to start assessment:', error)
        alert('Gagal memulai assessment. Silakan coba lagi.')
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    startAssessment()
  }, [params.moduleId, router])

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < assessment.items.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    if (!confirm('Yakin ingin submit assessment?')) return

    setSubmitting(true)
    try {
      // Save all answers
      const answersData = assessment.items.map((item: any, index: number) => ({
        item_id: item.item_id,
        user_answer: answers[index],
        time_spent: 5 // TODO: track actual time
      }))

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/assessments/${assessment.assessment_id}/answers`,
        { answers: answersData }
      )

      // Submit assessment
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/assessments/${assessment.assessment_id}/submit`
      )

      // Redirect to results
      router.push(`/assessments/${assessment.assessment_id}/results`)
    } catch (error) {
      console.error('Failed to submit assessment:', error)
      alert('Gagal submit assessment. Silakan coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!assessment) {
    return null
  }

  const item = assessment.items[currentQuestion]
  const progress = ((currentQuestion + 1) / assessment.total_items) * 100

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Back Button */}
        <Link 
          href="/dashboard" 
          className="text-gray-600 hover:text-navy mb-4 inline-block"
        >
          ← Kembali ke Dashboard
        </Link>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Pertanyaan {currentQuestion + 1} dari {assessment.total_items}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-teal h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-navy mb-6">
            {item.question_text}
          </h2>

          <div className="space-y-3">
            {item.options.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className={`w-full p-4 text-left rounded-lg border-2 transition ${
                  answers[currentQuestion] === option
                    ? 'border-teal bg-teal-light'
                    : 'border-gray-200 hover:border-teal'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-3 border-2 border-navy text-navy rounded-lg hover:bg-navy hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sebelumnya
            </button>

            {currentQuestion === assessment.items.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={submitting || !answers[currentQuestion]}
                className="px-6 py-3 bg-teal text-white rounded-lg hover:bg-teal-dark transition disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Assessment'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!answers[currentQuestion]}
                className="px-6 py-3 bg-teal text-white rounded-lg hover:bg-teal-dark transition disabled:opacity-50"
              >
                Lanjut
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
