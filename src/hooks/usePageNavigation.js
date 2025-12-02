import { useState, useCallback, useEffect } from 'react'

/**
 * Hook for managing page navigation state
 */
export function usePageNavigation() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [isAdmin, setIsAdmin] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [badgeCategory, setBadgeCategory] = useState(null)

  // Check URL for admin access on mount
  useEffect(() => {
    const path = window.location.pathname
    if (path === '/admin') {
      const loggedIn = localStorage.getItem('admin_logged_in') === 'true'
      setCurrentPage(loggedIn ? 'admin' : 'admin-login')
      setIsAdmin(loggedIn)
    }
  }, [])

  // Navigation handlers
  const navigateTo = useCallback((page) => {
    setShowCategoryModal(false) // Always close modal when navigating
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }, [])

  const handleGetStarted = useCallback(() => {
    setShowCategoryModal(true)
  }, [])

  const handleCategorySelect = useCallback((category) => {
    setBadgeCategory(category)
    setShowCategoryModal(false)
    setCurrentPage('designer')
    window.scrollTo(0, 0)
  }, [])

  const handleCategoryModalClose = useCallback(() => {
    setShowCategoryModal(false)
  }, [])

  const handleBackToHome = useCallback(() => {
    setShowCategoryModal(false) // Ensure modal is closed
    setCurrentPage('landing')
    setBadgeCategory(null)
    window.scrollTo(0, 0)
  }, [])

  // Admin handlers
  const handleAdminLogin = useCallback((loggedIn) => {
    setIsAdmin(loggedIn)
    setCurrentPage('admin')
  }, [])

  const handleAdminLogout = useCallback(() => {
    localStorage.removeItem('admin_logged_in')
    setIsAdmin(false)
    setCurrentPage('landing')
    window.history.pushState({}, '', '/')
  }, [])

  return {
    currentPage,
    isAdmin,
    showCategoryModal,
    badgeCategory,
    setBadgeCategory,
    navigateTo,
    handleGetStarted,
    handleCategorySelect,
    handleCategoryModalClose,
    handleBackToHome,
    handleAdminLogin,
    handleAdminLogout
  }
}

