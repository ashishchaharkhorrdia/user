import React from 'react'
import { useTranslation } from 'react-i18next'

const LanguageSwitcher = () => {
    const { i18n } = useTranslation()

    const languages = [
        { code: 'en', name: '🇬🇧 English' },
        { code: 'es', name: '🇪🇸 Español' },
        { code: 'fr', name: '🇫🇷 Français' },
        { code: 'hi', name: '🇮🇳 हिन्दी' }
    ]

    const handleLanguageChange = (langCode) => {
        i18n.changeLanguage(langCode)
        localStorage.setItem('preferredLanguage', langCode)
    }

    return (
        <div className='flex items-center'>
            <select
                onChange={(e) => handleLanguageChange(e.target.value)}
                value={i18n.language}
                className='px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 text-sm font-medium cursor-pointer hover:border-primary transition-colors'
            >
                {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.name}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default LanguageSwitcher
