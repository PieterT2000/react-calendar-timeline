/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{tsx,jsx,ts,js}'],
    theme: {
        extend: {
            colors: {
                itemColor: 'var(--item-color)',
                itemBackground: 'var(--item-background)',
                itemBorderColor: 'var(--item-border-color)',
                itemSelectedColor: 'var(--item-selected-color)',
                itemSelectedBackground: 'var(--item-selected-background)',
                itemSelectedBorderColor: 'var(--item-selected-border-color)',
                rowBackgroundEven: 'var(--row-background-even)',
                rowBackgroundOdd: 'var(--row-background-odd)',
                borderColor: 'var(--border-color)',
                sidebarColor: 'var(--sidebar-color)',
                sidebarBackgroundColor: 'var(--sidebar-background-color)',
                weekend: 'var(--weekend)',
                dateHeaderBgColor: 'var(--date-header-bg-color)',
              },
              borderWidth: {
                DEFAULT: 'var(--border-width)',
                thick: 'var(--thick-border-width)',
            },
        },
    },  
    plugins: [],
  }
  
  