import React from 'react'
import { CCarousel, CCarouselItem, CImage } from '@coreui/react'

const AboutPage = () => {
  return (
    <div>
      {/* SLIDER SHOW */}

      <CCarousel controls indicators>
        <CCarouselItem>
          <CImage
            className="d-block w-100"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQU3W93qi9lDp-BgfoEhsbBJMiqVSBj_qY4Og&usqp=CAU"
            alt="slide 1"
          />
        </CCarouselItem>
        <CCarouselItem>
          <CImage
            className="d-block w-100"
            src="https://wowslider.com/sliders/demo-93/data1/images/sunset.jpg"
            alt="slide 2"
          />
        </CCarouselItem>
        <CCarouselItem>
          <CImage
            className="d-block w-100"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRu0JAMPtLKtfmRY0TApaXq3s80-4RacHL1lA&usqp=CAU"
            alt="slide 3"
          />
        </CCarouselItem>
      </CCarousel>

      {/* ----------/--------------/---------- */}
    </div>
  )
}

export default AboutPage
