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

      // ── Pagamentos mensais ──────────────────────────────────────
      payments: [],

      addPayment(name) {
        const id = Date.now().toString()
        set({ payments: [...get().payments, { id, name }] })
      },

      deletePayment(id) {
        set({ payments: get().payments.filter(p => p.id !== id) })
      },

      getActivePaymentReminders() {
        const day = new Date().getDate()
        if (day >= 1 && day <= 8) return get().payments
        return []
      },

      toggleStudied(key) {
        const s = get().studied
        if (s[key]) {
          const studied = { ...s }; delete studied[key]
          const reviews = { ...get().reviews }
          ;[1,3,7,30].forEach(n => delete reviews[`${key}-d${n}`])
          set({ studied, reviews })
        } else {
          const t = today()
          set({
            studied: { ...s, [key]: t },
            reviews: {
              ...get().reviews,
              [`${key}-d1`]:  { date: addDays(t,1),  done:false },
              [`${key}-d3`]:  { date: addDays(t,3),  done:false },
              [`${key}-d7`]:  { date: addDays(t,7),  done:false },
              [`${key}-d30`]: { date: addDays(t,30), done:false },
            }
          })
        }
      },

      markReview(key, hard=false) {
        if (hard) {
          set({ reviews: { ...get().reviews, [key]: { date: addDays(today(),1), done:false } } })
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
          .filter(([,v]) => !v.done && v.date <= t)
          .map(([k,v]) => ({ key:k, ...v }))
      },

      getMilestoneProgress(portId, total) {
        let done = 0
        for (let i=0;i<total;i++) if (get().milestones[`${portId}-${i}`]) done++
        return total ? Math.round(done/total*100) : 0
      },
    }),
    { name: 'academico-plan-v1' }
  )
)
