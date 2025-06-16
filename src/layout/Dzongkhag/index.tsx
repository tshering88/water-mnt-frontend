import { useEffect, useState } from 'react'
import { Card, CardContent } from '../../components/ui/card'
import { MapPin, Mountain, Plus, Search } from 'lucide-react'
import { Input } from '../../components/ui/input'
import { RegionType } from '../../lib/constant'
import { getRegionBadgeColor } from '../../lib/utils'
import DzongkhagAddEditDialog from '../../components/DzongkhagAddEdit'
import { toast } from 'react-toastify'
import { useDzongkhagStore } from '../../store/useDzongkhagStore'
import type { DzongkhagUpdateType } from '../../types'
import DzongkhagList from '../../components/DzongkhagList'
import { Button } from '../../components/ui/button'
import Loading from '../../components/Loading'

const Dzongkhag = () => {
  const {
    dzongkhagLoading,
    dzongkhags,
    updateDzongkhag,
    createDzongkhag,
    deleteDzongkhag,
    fetchDzongkhags,
  } = useDzongkhagStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('All')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingDzongkhag, setEditingDzongkhag] =
    useState<DzongkhagUpdateType | null>(null)

  useEffect(() => {
    if (dzongkhags.length === 0) {
      fetchDzongkhags()
    }
  }, [fetchDzongkhags])

  const regions = ['All', 'Western', 'Central', 'Southern', 'Eastern']

  const filteredDzongkhags = dzongkhags
    .filter((dzongkhag) => dzongkhag && typeof dzongkhag === 'object')
    .filter((dzongkhag) => {
      const matchesSearch =
        (dzongkhag.name?.toLowerCase() ?? '').includes(
          searchTerm.toLowerCase()
        ) ||
        (dzongkhag.code?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())

      const matchesRegion =
        selectedRegion === 'All' || dzongkhag.region === selectedRegion

      return matchesSearch && matchesRegion
    })

  const regionStats = regions.slice(1).map((region) => {
    const regionDzongkhags = dzongkhags.filter(
      (d) => d && typeof d === 'object' && d.region === region
    )

    return {
      name: region,
      count: regionDzongkhags.length,
      population: regionDzongkhags.reduce(
        (sum, d) => sum + Number(d?.population ?? 0),
        0
      ),
      color: getRegionBadgeColor(region as RegionType),
    }
  })

  const formatNumber = (num: number | bigint) =>
    new Intl.NumberFormat().format(num)

  const handleAddOrUpdate = async (data: DzongkhagUpdateType) => {
    try {
      if (editingDzongkhag && editingDzongkhag._id) {
        await updateDzongkhag(editingDzongkhag._id, data)
        toast.success(`Updated: ${data.name}`)
      } else {
        await createDzongkhag(data)
        toast.success(`Created: ${data.name}`)
      }
      setDialogOpen(false)
      setEditingDzongkhag(null)
      await fetchDzongkhags()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Operation failed')
    }
  }

  const handleDeleteClick = async (id: string, name: string) => {
    try {
      await deleteDzongkhag(id)
      toast.success(`Deleted dzongkhag: ${name}`)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete dzongkhag'
      )
    }
  }

  const onAddDzongkhagClick = () => {
    setEditingDzongkhag(null)
    setDialogOpen(true)
  }

  const onEditDzongkhag = (dzongkhags: DzongkhagUpdateType) => {
    setEditingDzongkhag(dzongkhags)
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setEditingDzongkhag(null)
  }

  if (dzongkhagLoading) {
    return <Loading />
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800 p-3 sm:p-6'>
      <div className='max-w-7xl mx-auto space-y-6 sm:space-y-8'>
        {/* Header */}
        <div className='text-center space-y-3 sm:space-y-4'>
          <div className='flex items-center justify-center gap-2 sm:gap-3'>
            <Mountain className='h-8 w-8 sm:h-12 sm:w-12 text-indigo-600' />
            <h1 className='text-2xl sm:text-4xl font-medium text-white'>རྫོང་ཁག་</h1>
          </div>
          <h2 className='text-xl sm:text-3xl font-bold text-white'>
            20 Dzongkhags of Bhutan
          </h2>
          <p className='text-sm sm:text-lg text-white max-w-2xl mx-auto px-4 sm:px-0'>
            The Kingdom of Bhutan is divided into 20 districts (Dzongkha:
            dzongkhags), each with its own unique cultural heritage and natural
            landscapes.
          </p>
        </div>

        {/* Region Statistics */}
        <div className='grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8'>
          {regionStats.map((region) => (
            <Card
              key={region.name}
              className="hover:shadow-lg bg-white border border-gray-200 transition-all duration-300"
            >
              <CardContent className='p-4 sm:p-6'>
                <div className='flex items-center gap-3'>
                  <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${region.color} flex-shrink-0`}></div>
                  <div className='flex-1 min-w-0'>
                    <h3 className='font-semibold text-gray-900 text-sm sm:text-base break-words'>
                      {region.name}
                    </h3>
                    <p className='text-xs sm:text-sm text-gray-600'>
                      {region.count} dzongkhags
                    </p>
                    <p className='text-xs text-gray-500'>
                      {formatNumber(region.population)} people
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filter + Add Button */}
        <section className='flex flex-col gap-4 bg-gray-500 p-4 sm:p-6 rounded-xl shadow-sm'>
          {/* Search + Filter Row */}
          <div className='flex flex-wrap sm:flex-nowrap items-center gap-4'>
            {/* Search Input */}
            <div className='relative w-full sm:w-64'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white' />
              <Input
                placeholder='Search dzongkhags...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10 w-full'
              />
            </div>

            {/* Filter Buttons */}
            <div className='flex flex-wrap items-center gap-2'>
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all 
                  ${selectedRegion === region
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* Add Button */}
          <div className='flex justify-center w-full sm:justify-start'>
            <Button
              onClick={onAddDzongkhagClick}
              variant='outline'
              className='w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-indigo-700 border-indigo-700 bg-indigo-100 hover:bg-indigo-400 transition-all flex items-center gap-2'
            >
              <Plus className='w-4 h-4' strokeWidth={2.5} />
              Add Dzongkhag

            </Button>
          </div>
        </section>

        {/* Dzongkhags Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  xl:grid-cols-3 gap-4 sm:gap-6'>
          {filteredDzongkhags.map((dzongkhag) => (
            <div
              key={dzongkhag.code}
              className='hover:shadow-xl transition-all bg-white duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 group'
            >
              <DzongkhagList
                onEditDzongkhag={onEditDzongkhag}
                handleDeleteClick={handleDeleteClick}
                dzongkhagData={dzongkhag}
              />
            </div>
          ))}
        </div>


        {/* Summary Stats */}
        <Card className='bg-gradient-to-r from-indigo-600 to-purple-600 text-white'>
          <CardContent className='p-6 sm:p-8'>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center'>
              <div>
                <h3 className='text-2xl sm:text-3xl font-bold'>{dzongkhags.length}</h3>
                <p className='text-indigo-100 text-sm sm:text-base'>Total Dzongkhags</p>
              </div>
              <div>
                <h3 className='text-2xl sm:text-3xl font-bold'>{regionStats.length}</h3>
                <p className='text-indigo-100 text-sm sm:text-base'>Administrative Regions</p>
              </div>
              <div>
                <h3 className='text-2xl sm:text-3xl font-bold'>
                  {formatNumber(
                    dzongkhags.reduce(
                      (sum, d) => sum + Number(d?.population ?? 0),
                      0
                    )
                  )}
                </h3>
                <p className='text-indigo-100 text-sm sm:text-base'>Total Population</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        {searchTerm && filteredDzongkhags.length === 0 && (
          <div className='text-center py-12'>
            <MapPin className='h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4' />
            <h3 className='text-lg sm:text-xl font-semibold text-gray-600 mb-2'>
              No dzongkhags found
            </h3>
            <p className='text-sm sm:text-base text-gray-500 px-4'>
              Try adjusting your search terms or filters
            </p>
          </div>
        )}

        {/* Dialog */}
        <DzongkhagAddEditDialog
          open={dialogOpen}
          onClose={closeDialog}
          initialData={editingDzongkhag ?? null}
          onAddOrUpdate={handleAddOrUpdate}
        />
      </div>
    </div>
  )
}

export default Dzongkhag