import { supabase } from '../utils/supabase';

export const carService = {
  async getAll() {
    const { data, error } = await supabase
      .from('Cars')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      throw new Error('Failed to fetch cars');
    }
    return { Carss: data };
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('Cars')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error('Failed to fetch a car');
    }
    return data;
  },

  async create(car) {
    const { data, error } = await supabase
      .from('Cars')
      .insert([car])
      .select()
      .single();
    console.log('created cars', data);

    if (error) {
      throw new Error('Failed to create car');
    }
    return data;
  },

  async update(id, car) {

    const { data, error } = await supabase
      .from('Cars')
      .update(car)
      .eq('id', id)
      .select();

    console.log('Update response - Data:', data);
    console.log('Update response - Error:', error);

    if (error) {
      console.error('Supabase update error details:', error);
      throw new Error(`Failed to update cars: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.warn('Update returned no data - possible RLS policy issue');
    }

    return data;
  },

  async delete(id) {
    const { data, error } = await supabase
      .from('Cars')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      throw new Error('Failed to delete cars');
    }
    return data;
  },
};
