import { Component } from '@angular/core';

import { OwlOptions } from 'ngx-owl-carousel-o';

import { Testimonial, Astrologer } from 'src/app/core/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public testimonials: Testimonial[] = [
    { _id: 1, avatar: '../../../assets/images/testimonial/avatar-1.png', userName: 'Tanay', age: 30, address: 'Uttar Pradesh, India', message: `I was amazed by the accuracy and depth of insights I received through Raksa. Chatting with the astrologer provided me with valuable guidance on my career and relationships.  Highly recommended!`},
    { _id: 2, avatar: '../../../assets/images/testimonial/avatar-2.png', userName: 'Tanay', age: 30, address: 'Uttar Pradesh, India', message: `Raksa has been my go-to platform for astrology consultations. I connected with knowledgeable astrologers who provided profound interpretations of my birth chart. The convenience and expertise offered by Raksa have been invaluable in navigating life's challenges.`},
    { _id: 3, avatar: '../../../assets/images/testimonial/avatar-3.png', userName: 'Tanay', age: 30, address: 'Uttar Pradesh, India', message: `The live astrologers on Raksa have transformed my understanding of astrology. Their real-time guidance and accurate predictions have given me clarity and confidence in making important decisions. It has become an indispensable part of my spiritual journey.`}    
  ]

  public astrologers: Astrologer[] = [
    { _id: 1, avatar: '../../../assets/images/featured/avatar-1.png', astrologerName: 'Sanjay', experience: 'Vedik Astrology', tags: 'English, Hindi, Marathi', rating: 4.5, reviews: 1000, online: true },
    { _id: 2, avatar: '../../../assets/images/featured/avatar-2.png', astrologerName: 'Samira', experience: 'Vedik Astrology', tags: 'English, Hindi, Marathi', rating: 4.5, reviews: 2500, online: false },
    { _id: 3, avatar: '../../../assets/images/featured/avatar-3.png', astrologerName: 'Sanjay', experience: 'Vedik Astrology', tags: 'English, Hindi, Marathi', rating: 4.5, reviews: 1000, online: true },
    { _id: 4, avatar: '../../../assets/images/featured/avatar-4.png', astrologerName: 'Rita', experience: 'Vedik Astrology', tags: 'English, Hindi, Marathi', rating: 4.5, reviews: 2500, online: true },
    { _id: 5, avatar: '../../../assets/images/featured/avatar-5.png', astrologerName: 'Sanjay', experience: 'Vedik Astrology', tags: 'English, Hindi, Marathi', rating: 4.5, reviews: 1000, online: true }    
  ]

  testimonialOwlOptions: OwlOptions = {
    items: 3,
    autoplay: false,
    rewind: true,
    dots: false,
    autoWidth: false,
    nav: true,
    navText: ["<img src='../../../assets/images/circle-left.png'>", "<img src='../../../assets/images/circle-right.png'>"],
    margin: 32,
    stagePadding: 136,

    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 2
      },
      1200: {
        items: 3
      }
      
    }
  }
}
