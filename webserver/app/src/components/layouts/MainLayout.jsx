import { CartPopover } from '../../pages/CartPopover'
import { Outlet } from 'react-router-dom'

import Navbar from './Navbar'
import Footer from './Footer'

export default function MainLayout() {
  return (
    <div>
      <Navbar />
      <CartPopover/>
      <Outlet />
      <Footer />
    </div>
  )
}
