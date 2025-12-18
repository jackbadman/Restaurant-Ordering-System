import { useEffect, useState } from 'react'
import api from '../api/axios.js'
import defaultCategoryImage from '../assets/KebabHome.svg'
import shishImage from '../assets/shish_mixed.svg'
import donerImage from '../assets/donner_mixed.svg'
import kofteImage from '../assets/kofte_mixed.svg'
import sideImage from '../assets/salad.svg'
import drinkImage from '../assets/drinks.svg'
import sauceImage from '../assets/sauce.svg'

const categoryImages = {
  shish: shishImage,
  doner: donerImage,
  donner: donerImage,
  kofte: kofteImage,
  sides: sideImage,
  side: sideImage,
  salad: sideImage,
  drinks: drinkImage,
  drink: drinkImage,
  sauce: sauceImage,
  sauces: sauceImage,
}

export default function useMenu() {
  const [categories, setCategories] = useState([])
  const [isLoadingMenu, setIsLoadingMenu] = useState(false)
  const [menuError, setMenuError] = useState('')

  useEffect(() => {
    const loadMenu = async () => {
      setIsLoadingMenu(true)
      setMenuError('')
      try {
        const [categoriesResponse, itemsResponse] = await Promise.all([
          api.get('/api/categories'),
          api.get('/api/menuitems'),
        ])
        const categoryData = Array.isArray(categoriesResponse.data)
          ? categoriesResponse.data
          : []
        const itemData = Array.isArray(itemsResponse.data) ? itemsResponse.data : []

        const itemsByCategoryId = new Map()
        itemData.forEach((item) => {
          const rawCategory = item.categoryId
          const categoryId =
            typeof rawCategory === 'string' ? rawCategory : rawCategory?._id
          if (!categoryId) {
            return
          }
          if (!itemsByCategoryId.has(categoryId)) {
            itemsByCategoryId.set(categoryId, [])
          }
          itemsByCategoryId.get(categoryId).push(item)
        })

        const hydratedCategories = categoryData.map((category) => {
          const categoryId = category._id || category.id
          const itemsForCategory = itemsByCategoryId.get(categoryId) || []
          const categoryKey = (category.slug || category.name || '').trim().toLowerCase()
          const coverImage =
            category.imageURL ||
            category.image ||
            categoryImages[categoryKey] ||
            itemsForCategory.find((item) => item.imageURL)?.imageURL ||
            defaultCategoryImage

          return {
            id: categoryId,
            name: category.name,
            description: category.description || '',
            image: coverImage,
            items: itemsForCategory.map((item) => ({
              name: item.name,
              description: item.description || '',
              price: item.price,
              imageURL: item.imageURL || '',
            })),
          }
        })

        setCategories(hydratedCategories)
      } catch (err) {
        setMenuError('Unable to load the menu right now. Please try again soon.')
      } finally {
        setIsLoadingMenu(false)
      }
    }

    loadMenu()
  }, [])

  return { categories, isLoadingMenu, menuError }
}
