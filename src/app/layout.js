import 'bootstrap/dist/css/bootstrap.min.css';
import 'remixicon/fonts/remixicon.css';
import 'react-calendar/dist/Calendar.css';
import "swiper/css";
import "swiper/css/bundle";
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import 'react-tabs/style/react-tabs.css';

// Styles
import "../../styles/style.css";

import LayoutProvider from '@/providers/LayoutProvider';
export const metadata = {
  title: "Verity App",
  description: "Verity App - Employee Management Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <LayoutProvider>
          {children}
        </LayoutProvider>
      </body>
    </html>
  );
}
