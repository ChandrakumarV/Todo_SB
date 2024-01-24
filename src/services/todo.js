import { supabase } from "./supabase";



export async function getList(){
    let { data, error } = await supabase
        .from('todo')
        .select('*')
    
    if(error){
        console.error(error)
        throw new Error("data could not be fetch")
    }
    return data
}



export async function deleteList(id){
    const {data, error } = await supabase
    .from('todo')
    .delete()
    .eq('id', id)
    
    if(error){
        console.error(error)
        throw new Error("List could not be delete")
    }
    return data
}



export async function createList(titleDescriptiondata){
    console.log("create :",titleDescriptiondata)
    const { data, error } = await supabase
    .from('todo')
    .insert([
        { ...titleDescriptiondata },
    ])
    .select()
    
    if(error){
        console.error(error)
        throw new Error("List could not be create")
    }
    return data
}



export async function updateList(updateData){
    console.log("update :",updateData)
   
    const {title,description,id} = updateData
    const { data, error } = await supabase
    .from('todo')
    .update({ title:title, description:description })
    .eq('id', id)
    .select()

    
    if(error){
        console.error(error)
        throw new Error("List could not be update")
    }
    return data
}


