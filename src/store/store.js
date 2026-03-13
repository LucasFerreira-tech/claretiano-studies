import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { today, addDays } from '../utils'

export const useStore = create(
  persist(
    (set, get) => ({
      studied:    {},
      reviews:    {},
      milestones: {},

      // ── Tarefas do dia ──────────────────────────────────────────
      tasks: [],

      addTask(title, date) {
        const id = Date.now().toString()
        set({ tasks: [...get().tasks, { id, title, date, done: false }] })
      },

      toggleTask(id) {
        set({ tasks: get().tasks.map(t => t.id === id ? { ...t, done: !t.done } : t) })
      },

      deleteTask(id) {
        set({ tasks: get().tasks.filter(t => t.id !== id) })
      },

      getTodayTasks() {
        return get().tasks.filter(t => t.date === today())
      },

      // ── Atividades de estudo ────────────────────────────────────
      activities: [],

      addActivity(title, description, subject, cycle) {
        const id = Date.now().toString()
        set({
          activities: [...get().activities, {
            id, title, description, subject, cycle: cycle || null,
            done: false, createdAt: today(),
          }]
        })
      },

      toggleActivity(id) {
        const activity = get().activities.find(a => a.id === id)
        if (!activity) return
        const wasDone = activity.done
        set({ activities: get().activities.map(a => a.id === id ? { ...a, done: !a.done } : a) })

        // Ao CONCLUIR: cria revisões automáticas baseadas na disciplina
        if (!wasDone && activity.subject && activity.subject !== 'Geral') {
          const t = today()
          const discId = activity.subject
          const reviewKey = `ativ-${id}`
          const d1  = get()._nextClassDay(t, discId, 1)
          const d3  = get()._nextClassDay(t, discId, 3)
          const d30 = addDays(t, 30)
          set({
            reviews: {
              ...get().reviews,
              [`${reviewKey}-d1`]:  { date: d1,  done: false, label: activity.title },
              [`${reviewKey}-d3`]:  { date: d3,  done: false, label: activity.title },
              [`${reviewKey}-d30`]: { date: d30, done: false, label: activity.title },
            }
          })
        }
        // Ao DESMARCAR: remove as revisões
        if (wasDone) {
          const reviewKey = `ativ-${id}`
          const reviews = { ...get().reviews }
          ;[1, 3, 30].forEach(n => delete reviews[`${reviewKey}-d${n}`])
          set({ reviews })
        }
      },

      deleteActivity(id) {
        const reviewKey = `ativ-${id}`
        const reviews = { ...get().reviews }
        ;[1, 3, 30].forEach(n => delete reviews[`${reviewKey}-d${n}`])
        set({
          activities: get().activities.filter(a => a.id !== id),
          reviews,
        })
      },

      getPendingActivities() {
        return get().activities.filter(a => !a.done)
      },

      // ── Revisões com repetição espaçada baseada na grade semanal ─
      // Dias de aula por matéria: 0=Dom,1=Seg,2=Ter,3=Qua,4=Qui,5=Sex,6=Sáb
      _nextClassDay(fromDate, discId, nthDay = 1) {
        const DISC_DAYS = {
          SO:  [1, 2, 4, 5],
          DPE: [1, 3, 4, 5],
          AMT: [3],
          ANT: [2],
        }
        const days = DISC_DAYS[discId] || [1, 2, 3, 4, 5]
        let d = new Date(fromDate)
        let count = 0
        for (let i = 1; i <= 60; i++) {
          d.setDate(d.getDate() + 1)
          if (days.includes(d.getDay())) {
            count++
            if (count === nthDay) return d.toISOString().split('T')[0]
          }
        }
        return addDays(fromDate, nthDay * 7)
      },

      toggleStudied(key) {
        // key format: "C2-SO-3"  → discId is second-to-last segment
        const parts = key.split('-')
        const discId = parts[parts.length - 2]
        const s = get().studied
        if (s[key]) {
          const studied = { ...s }; delete studied[key]
          const reviews = { ...get().reviews }
          ;[1, 3, 30].forEach(n => delete reviews[`${key}-d${n}`])
          set({ studied, reviews })
        } else {
          const t = today()
          const d1  = get()._nextClassDay(t, discId, 1)
          const d3  = get()._nextClassDay(t, discId, 3)
          const d30 = addDays(t, 30)
          set({
            studied: { ...s, [key]: t },
            reviews: {
              ...get().reviews,
              [`${key}-d1`]:  { date: d1,  done: false },
              [`${key}-d3`]:  { date: d3,  done: false },
              [`${key}-d30`]: { date: d30, done: false },
            }
          })
        }
      },

      markReview(key, hard = false) {
        if (hard) {
          set({ reviews: { ...get().reviews, [key]: { date: addDays(today(), 1), done: false } } })
        } else {
          const reviews = { ...get().reviews }
          reviews[key] = { ...reviews[key], done: true }
          set({ reviews })
        }
      },

      toggleMilestone(key) {
        set({ milestones: { ...get().milestones, [key]: !get().milestones[key] } })
      },

      getDueReviews() {
        const t = today()
        return Object.entries(get().reviews)
          .filter(([, v]) => !v.done && v.date <= t)
          .map(([k, v]) => ({ key: k, ...v }))
      },

      getMilestoneProgress(portId, total) {
        let done = 0
        for (let i = 0; i < total; i++) if (get().milestones[`${portId}-${i}`]) done++
        return total ? Math.round(done / total * 100) : 0
      },

      // ── Aviso de pagamento (sem cadastro, só lógica de data) ────
      isPaymentPeriod() {
        const day = new Date().getDate()
        return day >= 1 && day <= 8
      },
    }),
    { name: 'academico-plan-v2' }
  )
)
