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
import Loader from '../../components/Loader'

const Dzongkhag = () => {
  const {
    loading,
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
    fetchDzongkhags()
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

  if (loading) {
    return <Loader />
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6'>
      <div className='max-w-7xl mx-auto space-y-8'>
        {/* Header */}
        <div className='text-center space-y-4'>
          <div className='flex items-center justify-center gap-3'>
            <Mountain className='h-12 w-12 text-indigo-600' />
            <h1 className='text-4xl font-bold text-gray-900'>རྫོང་ཁག་</h1>
          </div>
          <h2 className='text-3xl font-bold text-gray-800'>
            20 Dzongkhags of Bhutan
          </h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            The Kingdom of Bhutan is divided into 20 districts (Dzongkha:
            dzongkhags), each with its own unique cultural heritage and natural
            landscapes.
          </p>
        </div>

        {/* Region Statistics */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
          {regionStats.map((region) => (
            <Card
              key={region.name}
              className='hover:shadow-lg transition-all duration-300'
            >
              <CardContent className='p-6'>
                <div className='flex items-center gap-3'>
                  <div className={`w-4 h-4 rounded-full ${region.color}`}></div>
                  <div className='flex-1'>
                    <h3 className='font-semibold text-gray-900'>
                      {region.name}
                    </h3>
                    <p className='text-sm text-gray-600'>
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
        <div className='flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-500 p-6 rounded-xl shadow-sm'>
          <div className='relative flex-1 max-w-md'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white' />
            <Input
              placeholder='Search dzongkhags...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10'
            />
          </div>

          <div className='flex flex-wrap items-center gap-2'>
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedRegion === region
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {region}
              </button>
            ))}
            <Button
              onClick={onAddDzongkhagClick}
              variant='outline'
              className='ml-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-indigo-700 border-indigo-700 bg-indigo-100 hover:bg-indigo-400 transition-all flex items-center gap-2'
            >
              <Plus className='w-4 h-4' strokeWidth={2.5} />
              Add Dzongkhag
            </Button>
          </div>
        </div>

        {/* Dzongkhags Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2  gap-6'>
          {filteredDzongkhags.map((dzongkhag) => (
            <div
              key={dzongkhag.code}
              className='hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group'
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
          <CardContent className='p-8'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
              <div>
                <h3 className='text-3xl font-bold'>{dzongkhags.length}</h3>
                <p className='text-indigo-100'>Total Dzongkhags</p>
              </div>
              <div>
                <h3 className='text-3xl font-bold'>{regionStats.length}</h3>
                <p className='text-indigo-100'>Administrative Regions</p>
              </div>
              <div>
                <h3 className='text-3xl font-bold'>
                  {formatNumber(
                    dzongkhags.reduce(
                      (sum, d) => sum + Number(d?.population ?? 0),
                      0
                    )
                  )}
                </h3>
                <p className='text-indigo-100'>Total Population</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        {searchTerm && filteredDzongkhags.length === 0 && (
          <div className='text-center py-12'>
            <MapPin className='h-16 w-16 text-gray-300 mx-auto mb-4' />
            <h3 className='text-xl font-semibold text-gray-600 mb-2'>
              No dzongkhags found
            </h3>
            <p className='text-gray-500'>
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