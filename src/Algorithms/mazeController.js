import { Node , Block } from './helper_method'
import { breadth_first_search , stop_breadth_first_search }from './solve_maze/breadth_first_search'
import { depth_first_search , stop_depth_first_search }from './solve_maze/depth_first_search'
import { a_star , stop_a_star }from './solve_maze/a_star'
import { greedy_best_first_search , stop_greedy_best_first_search }from './solve_maze/greedy_best_first_search'
import { dijkstra , stop_dijkstra }from './solve_maze/dijkstra'
import { bidirectional_dijkstra , stop_bidirectional_dijkstra }from './solve_maze/bidirectional_dijkstra'
import { bidirectional_a_star , stop_bidirectional_a_star }from './solve_maze/bidirectional_a_star'

import {self_solve , stop_self_solve} from './self_solve'

import { recursive_dividion_maze } from './draw_maze/recursive_division_maze_generation'
import { prims_maze , stop_prims_draw_maze} from './draw_maze/prims_maze_generation'
import { depth_first_search_maze , stop_depth_first_search_draw_maze } from './draw_maze/depth_first_search_maze_generation'

let size , width , height , cols , rows , select_draw_algorithims , speed 

let delay, canvas , c , start_node, end_node , nodes , stack , frame_per_second , maze_speed , myTimeOut , start_location , end_location 

const setUp = (props) => {
  stop_breadth_first_search()
  stop_depth_first_search()
  stop_a_star()
  stop_dijkstra()
  stop_bidirectional_dijkstra()
  stop_greedy_best_first_search()
  stop_bidirectional_a_star()
  stop_self_solve()

  stop_depth_first_search_draw_maze()
  stop_prims_draw_maze()

  c = props.c
  canvas = props.canvas 
  stack = []

  cols = props.cols 
  rows = props.rows 
  size = props.size 
  width = props.width
  height = props.height
  select_draw_algorithims = props.select_draw_algorithims

  size = Math.floor(width / cols)

  start_location = {x: size / 2 , y: size / 2}
  end_location = {x: (cols - 1) * size + (size / 2) , y: (rows - 1) * size + (size / 2)}

  delay = 0 
  speed = props.speed
  maze_speed = 700

  frame_per_second = 1000

  canvas.width = width
  canvas.height = height

  nodes = []
  draw_divide_maze(props)
  clearTimeout(myTimeOut)
  return nodes
}

const draw_divide_maze = (props) => {
  for(let i = 0; i < rows ; i ++){
    for(let j = 0; j < cols ; j ++){
      let walls = select_draw_algorithims === "Recursive Division" 
        ? [false , false , false ,false]  
        : [true , true , true , true]

      let x = j * size + (size / 2)
      let y = i * size + (size / 2)
      let node = new Node(x, y , c , size , walls)
      if(select_draw_algorithims !== ""){
        if(i === 0){
          node.walls[0] = true
        }else if(i === rows - 1){
          node.walls[2] = true
        }

        if(j === 0){
          node.walls[3] = true
        }else if(j === cols - 1){
          node.walls[1] = true
        }

        if(i === 0 && j === 0) {
            node.walls[0] = false 
        }
        if(j === cols - 1 && i === rows - 1){
          node.walls[1] = false
        }

        if(i === 0 && j === 0){
            stack.push(node)
        }
      }
      nodes.push(node)
    }
  }

  start_node = new Block(start_location.x , start_location.y , c , size , "blue")
  end_node = new Block(end_location.x , end_location.y , c , size , "green" )

  switch (select_draw_algorithims) {
    case "Depth first search":
      depth_first_search_maze({nodes , canvas , c , stack , size , cols , rows , frame_per_second , speed })
      break
    case "Prim's": 
      prims_maze({size , nodes , cols , rows , canvas , c , frame_per_second , speed})
      break 
    case "Recursive Division": 
      let draw_delay = recursive_dividion_maze({delay , speed , size , cols , rows , nodes})
      if(draw_delay){
        setTimeout(() => {
            props.check_recursive_delay(true)
          }, draw_delay * speed);
        }
      break 
    default:
      default_grid()
      break 
  }

}

const default_grid = () => {
  for(let i = 0 ; i < nodes.length ; i ++){
    nodes[i].draw()
  }
}

const run_solve_maze = (algorithms) => {
  stop_greedy_best_first_search()
  stop_a_star()
  stop_dijkstra()
  stop_breadth_first_search()
  stop_depth_first_search()
  stop_bidirectional_dijkstra()
  stop_bidirectional_a_star()

  stop_self_solve()

  switch (algorithms) {
    case "A star":
      a_star({start_node , end_node , nodes , c , canvas , size})
      break
    case "Depth first search": 
      depth_first_search({nodes , start_node , end_node , c , canvas , size})
      break
    case "Breadth first search": 
      breadth_first_search({c , canvas , size , nodes , start_node , end_node })
      break 
    case "Dijkstra's": 
      dijkstra({start_node , end_node , nodes , c , canvas , size})
      break 
    case "Greedy best first search": 
      greedy_best_first_search({start_node , end_node , nodes , c , canvas , size})
      break 
    case "Bidirectional a star": 
      bidirectional_a_star({start_node , end_node , nodes , c , canvas , size})
      break 
    case "Bidirectional dijkstra's": 
      bidirectional_dijkstra({start_node , end_node , nodes , c , canvas , size})
      break 
    default: 
      self_solve({nodes , start_node , end_node , c , canvas , size})
      break 
  }
}

const update_info = props => {
  if(props.start_location){
    start_location = props.start_location
    start_node = new Block(start_location.x , start_location.y , c , size , "blue")
  }

  if(props.end_location){
    end_location = props.end_location
    end_node = new Block(end_location.x , end_location.y , c , size , "green" )
  }
}

export {setUp , run_solve_maze , update_info}
