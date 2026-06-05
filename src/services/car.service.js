import { supabase } from "../utils/supabase";


export const carService = {
    async getAllCars() {
        const { data, error } = await supabase.from('Cars').select('*');
        if (error) {
            throw error;
        }
        return data;
    },
    async createCar(carData) {
        const { data, error } = await supabase.from('Cars').insert([carData]).select().single();
        if (error) {
            throw error;
        }
        return data;
    },

    async getCarById(id) {
        const { data, error } = await supabase.from('Cars').select('*').eq('id', id).single();
        if (error) {
            throw error;
        }
        return data;
    },
    async delete(id) {
        const { data, error } = await supabase.from('Cars').delete().eq('id', id);
        if (error) {
            throw error;
        }
        return data;
    },
    async update(id, carData) {
        const { data, error } = await supabase.from('Cars').update(carData).eq('id', id);
        if (error) {
            throw error;
        }
        return data;
    }


};


