import React from 'react'
import Banner from '../components/Banner'
import { Helmet } from 'react-helmet'
import FeaturedProduct from '../components/FeaturedProduct'
import Promotions from '../components/Promotions'
import TrendingProduct from '../components/TrendingProduct'

export default function Home() {
  return (
    <div>
        <Helmet>
            <title> Homepage - TechProd </title>
        </Helmet>
        <Banner></Banner>
        <FeaturedProduct></FeaturedProduct>
        <TrendingProduct></TrendingProduct>
        <Promotions></Promotions>
    </div>
  )
}
