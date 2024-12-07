import { activitiesDbTableName } from '../../config'
import { supabase } from './authentication'

const shareActivity = async (id: string, isShared: boolean): Promise<void> => {
  const { error } = await supabase
    .from(activitiesDbTableName)
    .update([
      {
        is_shared: isShared,
      },
    ])
    .match({ activity_id: id })

  if (!error) return
  else throw error
}

export default shareActivity
