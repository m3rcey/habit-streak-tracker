import { useState, useEffect } from 'react'

interface Habit {
  id: number
  name: string
  history: Record<string, boolean> // date string -> completed
}

function App() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('habitStreaks')
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Morning smoothie', history: {} },
      { id: 2, name: 'Workout', history: {} },
      { id: 3, name: 'Read', history: {} },
    ]
  })
  const [newHabit, setNewHabit] = useState('')

  useEffect(() => {
    localStorage.setItem('habitStreaks', JSON.stringify(habits))
  }, [habits])

  const getDateKey = (date: Date) => date.toISOString().split('T')[0]
  const today = getDateKey(new Date())
  

  const getStreak = (habit: Habit): number => {
    let streak = 0
    const date = new Date()
    while (true) {
      const key = getDateKey(date)
      if (habit.history[key]) {
        streak++
        date.setDate(date.getDate() - 1)
      } else if (key === today) {
        // Don't count today as broken if not yet done
        date.setDate(date.getDate() - 1)
      } else {
        break
      }
    }
    return streak
  }

  const toggleDay = (habitId: number, dateKey: string) => {
    setHabits(habits.map(h => {
      if (h.id === habitId) {
        return { ...h, history: { ...h.history, [dateKey]: !h.history[dateKey] } }
      }
      return h
    }))
  }

  const addHabit = () => {
    if (newHabit.trim()) {
      setHabits([...habits, { id: Date.now(), name: newHabit.trim(), history: {} }])
      setNewHabit('')
    }
  }

  const deleteHabit = (id: number) => {
    setHabits(habits.filter(h => h.id !== id))
  }

  // Get last 7 days
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return getDateKey(d)
  })

  const dayLabels = days.map(d => {
    const date = new Date(d)
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  })

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f172a',
      color: '#fff',
      fontFamily: 'system-ui, sans-serif',
      padding: '2rem',
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#f97316' }}>
          🔥 Habit Streaks
        </h1>
        <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '180px repeat(7, 1fr) 80px',
          gap: '0.25rem',
          marginBottom: '0.5rem',
          padding: '0 0.5rem',
        }}>
          <div style={{ color: '#9ca3af', fontWeight: '600', fontSize: '0.75rem' }}>HABIT</div>
          {dayLabels.map((day, i) => (
            <div key={i} style={{
              textAlign: 'center',
              color: days[i] === today ? '#f97316' : '#9ca3af',
              fontWeight: days[i] === today ? 'bold' : 'normal',
              fontSize: '0.7rem',
            }}>
              {day}
            </div>
          ))}
          <div style={{ color: '#9ca3af', fontWeight: '600', fontSize: '0.75rem' }}>STREAK</div>
        </div>

        {/* Habits */}
        {habits.map(habit => {
          const streak = getStreak(habit)
          return (
            <div key={habit.id} style={{
              display: 'grid',
              gridTemplateColumns: '180px repeat(7, 1fr) 80px',
              gap: '0.25rem',
              marginBottom: '0.5rem',
              alignItems: 'center',
              padding: '0.5rem',
              background: '#1e293b',
              borderRadius: '0.5rem',
            }}>
              <div style={{ fontWeight: '500', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{habit.name}</span>
                <button onClick={() => deleteHabit(habit.id)} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: 0 }}>×</button>
              </div>
              {days.map(day => (
                <button
                  key={day}
                  onClick={() => toggleDay(habit.id, day)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '0.375rem',
                    border: 'none',
                    background: habit.history[day] ? '#22c55e' : '#374151',
                    cursor: 'pointer',
                    margin: '0 auto',
                    fontSize: '0.875rem',
                    color: '#fff',
                  }}
                >
                  {habit.history[day] ? '✓' : ''}
                </button>
              ))}
              <div style={{
                textAlign: 'center',
                color: streak > 0 ? '#f97316' : '#6b7280',
                fontWeight: 'bold',
                fontSize: '0.875rem',
              }}>
                {streak > 0 ? `🔥 ${streak}` : '-'}
              </div>
            </div>
          )
        })}

        {/* Add */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <input
            type="text"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addHabit()}
            placeholder="New habit..."
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid #374151',
              background: '#1e293b',
              color: '#fff',
              fontSize: '0.875rem',
            }}
          />
          <button
            onClick={addHabit}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#f97316',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
