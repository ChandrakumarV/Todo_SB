import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { createList, deleteList, getList, updateList } from "./services/todo";
import "./index.css";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    quries: {
      staleTime: 2000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Todo />
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "#e3e3e3",
          },
        }}
      />
    </QueryClientProvider>
  );
}

function Todo() {
  const [title, setTitle] = useState("");
  const [description, setdescription] = useState("dsf");
  const [id, setID] = useState(null);
  const [isOpen,setisOpen ] =useState(false)

  const {
    isLoading,
    error,
    data: listData,
  } = useQuery({
    queryKey: ["todo"],
    queryFn: getList,
  });

  const { mutate: createMutate,isPending: isCreating } = useMutation({
    mutationFn: createList,
    onSuccess: () => {
      switchToCreate()
      toast.success("List create successfully");
      queryClient.invalidateQueries({
        queryKey: ["todo"],
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const {mutate:updateMutate,isPending: isupdating} = useMutation({
    mutationFn : updateList,
    onSuccess:()=>{
        switchToCreate()
          queryClient.invalidateQueries({
              queryKey:['todo']
          })
          setisOpen(false)
      },
      onError:(err)=>{
          alert(err.message)
      }
    })

  function edit(data) {
    setisOpen(true)
    setTitle(data.title);
    setdescription(data.description);
    setID(data.id);
  }

  function switchToCreate() {
    setTitle("");
    setdescription("");
    setID(null);
  }

  function createHandler(e){
    e.preventDefault()
    if(id){ //update
      updateMutate({id,title,description})
    }
    else{ //create 
      createMutate({title, description})
    }
  }

  if (isLoading) {
    return <p>Loading</p>;
  }

  return (
    <div className="container">
      <header>
        <h1>Todo List</h1>
        <button onClick={()=>setisOpen(cur=>!cur)}>{isOpen?"-":"+"}</button>
      </header>
      {isOpen&&<form onSubmit={createHandler}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title"
          />
        <textarea
          name=""
          id=""
          cols="30"
          rows="10"
          value={description}
          onChange={(e) => setdescription(e.target.value)}
          placeholder="Enter a description"
          ></textarea>
          <div className="btns"> 
        <button type="submit">{id ? isupdating?"Updating": "Update" :isCreating?"Creating...": "Create"}</button>
        {id && <button onClick={switchToCreate}>Create</button>}
        {isOpen&&<button onClick={()=>setisOpen(false)}>Close</button>}
          </div>
      </form>
        }

      <div className="lists">
        <ul>
          {listData.map((list) => (
            <List key={list.id} data={list} edit={edit} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function List({ data, edit }) {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate } = useMutation({
    mutationFn: deleteList,
    onSuccess: () => {
      toast.success("List delete successfully");
      queryClient.invalidateQueries({
        queryKey: ["todo"],
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const { id, title, description } = data;

  return (
    <li>
      <div className="ListHead">
        <h3>{title}</h3>
        <div className="right">

        <img
          src="https://cdn-icons-png.flaticon.com/256/84/84380.png"
          alt=""
          onClick={() => edit(data)}
          />
        <button onClick={() => mutate(id)} disabled={isDeleting}>
          {isDeleting ? "Deleting.." : "Delete"}
        </button>
          </div>
      </div>
        <p>{description}</p>

    </li>
  );
}
