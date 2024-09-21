import CheckoutPageComponent from "@/components/checkoutPageComponent"; 

import React, {Suspense} from 'react'

const CheckoutPageWrapper = () => {
  return (
      <Suspense fallback={<p>Loading...</p>}>
        <CheckoutPageComponent />
      </Suspense>
  )
}

export default CheckoutPageWrapper