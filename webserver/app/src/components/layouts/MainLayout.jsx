import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { CartPopover } from '../../pages/CartPopover'

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
