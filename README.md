# Advent of Code 2024

My solutions to the [AoC 2024](https://adventofcode.com/2024) challenges written in [Civet](https://civet.dev).

## Day 1: Historian Hysteria ⭐⭐

```ts
[left, right] := input
  |> getLines
  |> .map toNumbers
  |> rotate
  |> .map .sort asc

log 'Part 1', for sum i in left
  abs left[i] - right[i]

log 'Part 2', for sum i in left
  left[i] * counter(right)[left[i]]
```

## Day 2: Red-Nosed Reports ⭐⭐

```ts
reports := getLines(input).map toNumbers

function isSafe(report: number[])
  dir := report.1 - report.0 > 0
  for every _,i of report[..-2]
   (0 < report[i + int dir] - report[i + int !dir] < 4)

part1 := reports.filter (report) => isSafe report
part2 := reports.filter (report) => isSafe(report) or report.some (level, index) => isSafe report.toSpliced index, 1

console.log part1#
console.log part2#
```

## Day 3: Mull It Over ⭐⭐

```ts
mul := multiply

input.match /mul\(\d+,\d+\)/g |> ?.reduce (acc, match) => acc + eval(match), 0 |> log

let enabed = true
input.match /mul\(\d+,\d+\)|do(|n't)\(\)/g |> ?.reduce (acc, match) => 
  if match is 'do()' then enabed = true
  if match is 'don\'t()' then enabed = false
  if enabed and match.includes 'mul' then 
    return acc + eval match
  return acc
,0 |> log
```

## Day 4: Ceres Search ⭐⭐

```ts
map := getArray2d input
points: Point<number>[][] := flatten for x of [-1..1]
  for y of [-1..1]
    for l of [1..3]
      {x: x * l, y: y * l}

log sumLoop2d map, ({y, x}, item) =>
  if item is not 'X' return 0
  sum points.map (row) =>
    'MAS' is for join point of row
      map[y + point.y]?[x + point.x]

validDiagonals := ['MS', 'SM']
log sumLoop2d map, ({y, x}, item) =>
  if item is not 'A' return 0
  diagonal1 := map[y - 1]?[x - 1] + map[y + 1]?[x + 1]
  diagonal2 := map[y - 1]?[x + 1] + map[y + 1]?[x - 1]
  diagonal1 is in validDiagonals and diagonal2 is in validDiagonals
```

## Day 5: Print Queue ⭐⭐

```ts
[orders, updates] .= input.split('\n\n').map(getLines).map .map toNumbers

isValid := (update: number[]) => {
  indices := new Map update.map (a, b) => [a, b]

  orders.every (order) =>
    [aIndex, bIndex] := [indices.get(order.0), indices.get(order.1)]
    aIndex && bIndex ? aIndex < bIndex : true
}

log for sum update of updates.filter (update) => isValid update
  update[(update# - 1) / 2]

fixedUpdates := updates.filter (update) => !isValid update |> .map (update) => 
  update.toSorted (a, b) => 
    order := orders.find ([x, y]) => (x is a and y is b) or (x is b and y is a)
    order ? order.0 is a ? -1 : 1 : 0

log for sum update of fixedUpdates
  update[(update# - 1) / 2]
```

## Day 6: Guard Gallivant ⭐⭐

```ts
grid := getArray2d input

startY := grid.findIndex (x) => x.includes '^'
startX := grid[startY].indexOf '^'

start := { x: startX, y: startY }

enum Direction {
  UP = 0
  RIGHT = 1
  DOWN = 2
  LEFT = 3
}

walk := (grid: string[][], { x, y }: Point<number>, dir: Direction) =>
  path := new Set [`${y}.${x}`]
  positions := new Set [`${y}.${x}.${dir}`]

  rotate := () => dir = (dir + 1) % 4
  loop
    switch dir
      when Direction.UP
        grid[y - 1]?[x] is '#' ? rotate() : y--
      when Direction.RIGHT
        grid[y]?[x + 1] is '#' ? rotate() : x++
      when Direction.DOWN
        grid[y + 1]?[x] is '#' ? rotate() : y++
      when Direction.LEFT
        grid[y]?[x - 1] is '#' ? rotate() : x--
    
    break with { path, valid: 1 } if positions.has `${y}.${x}.${dir}`
    break with { path, valid: 0 } unless grid[y]?[x]

    path.add `${y}.${x}`
    positions.add `${y}.${x}.${dir}`


{ path } := walk grid, start, Direction.UP

log path.size
log for sum pos of path
  [y, x] := pos.split '.'
  tmp := cloneDeep(grid)
  tmp[int y][int x] = '#'
  { valid } := walk tmp, start, Direction.UP
  valid
```

## Day 7: Bridge Repair ⭐⭐

```ts
lines: [number, number[]][] := getLines input |>
  .map(toNumbers)
  .map (num) => [num.0, num[1..]]

compute := (operators: string) => lines.map [test, values] =>
  temp .= 0
  allPermutations := permutations operators, values.#-1
  check := for some permutation of allPermutations
    res .= values.0
    for op, i of permutation
      switch op
        when '+'
          res += values[i+1]
        when '*'
          res *= values[i+1]
        when '|'
          res = +`${res}${values[i+1]}`
    test is res
  if check
    temp += test

log sum compute '+*'
log sum compute '+*|'
```

## Day 8: Resonant Collinearity ⭐⭐

```ts
grid := getArray2d input

antennaMap: { [key: string]: number[][]} := {}

loop2d grid, ({y, x}, freq) =>
  if freq is not '.'
    if not antennaMap[freq]
      antennaMap[freq] = []
    antennaMap[freq].push [y, x]

isInBounds := (loc: number[]) => 0 <= loc.0 && loc.0 < grid# && 0 <= loc.1 && loc.1 < grid.0# 
asKey := (loc: number[]) => `${loc.0}.${loc.1}`

function findAntinodeLocations(part: number): number
    antinodeLocations := new Set<string>();
    for freq in antennaMap
      for i of [0...antennaMap[freq]#]
        for j of [i + 1...antennaMap[freq]#]
          [x1, y1] := antennaMap[freq][i]
          [x2, y2] := antennaMap[freq][j]
  
          xdiff := x2 - x1
          ydiff := y2 - y1
          
          antinodeLoc1 .= [x1-xdiff, y1-ydiff]
          antinodeLoc2 .= [x2+xdiff, y2+ydiff]
  
          if part is 1
            if isInBounds antinodeLoc1
              antinodeLocations.add asKey antinodeLoc1
            if isInBounds antinodeLoc2
              antinodeLocations.add asKey antinodeLoc2
          else if part is 2
            antinodeLocations.add asKey [x1, y1]
            antinodeLocations.add asKey [x2, y2]

            while isInBounds(antinodeLoc1) or isInBounds(antinodeLoc2)
              antinodeLocations.add asKey antinodeLoc1 if isInBounds antinodeLoc1
              antinodeLocations.add asKey antinodeLoc2 if isInBounds antinodeLoc2
              
              antinodeLoc1 = [antinodeLoc1.0 - xdiff, antinodeLoc1.1 - ydiff]
              antinodeLoc2 = [antinodeLoc2.0 + xdiff, antinodeLoc2.1 + ydiff]

    // copy .= cloneDeep grid
    // for loc of antinodeLocations
    //   [y, x] := loc.split '.'
    //   copy[int y][int x] = '#'
    // log printArray copy
    
    antinodeLocations.size


log findAntinodeLocations 1
log findAntinodeLocations 2
```

## Day 9: Disk Fragmenter ⭐⭐

```ts
disk := map input, int
move := 256

hash := (b: string, i: number) => b is '.' ? 0 : i * (-move + int b.codePointAt(0)!)

id .= 0
files: string[] := []
blocksP1 .= for join d, i of disk
  if i % 2
    '.'.repeat d  
  else
    file := String.fromCodePoint(move + id++).repeat d
    files.push file
    file

blocksP2 .= blocksP1
// p1
for file of [...blocksP1].reverse()
  fileIndex := blocksP1.lastIndexOf file
  spaceIndex := blocksP1.indexOf '.'

  if spaceIndex < fileIndex and spaceIndex > -1
    blocksP1 = blocksP1[...fileIndex] + '.'.repeat(file#) + blocksP1[fileIndex + file#..]
    blocksP1 = blocksP1[...spaceIndex] + file + blocksP1[spaceIndex + file#..]
    blocksP1
// p2
for file of files.reverse()
  fileIndex := blocksP2.indexOf file
  spaceIndex := blocksP2.indexOf '.'.repeat file#

  if spaceIndex < fileIndex and spaceIndex > -1
    blocksP2 = blocksP2[...fileIndex] + '.'.repeat(file#) + blocksP2[fileIndex + file#..]
    blocksP2 = blocksP2[...spaceIndex] + file + blocksP2[spaceIndex + file#..]
    blocksP2

log sum for block, i of blocksP1
  hash block, i

log sum for block, i of blocksP2
  hash block, i
```

## Day 10: Hoof It ⭐⭐

```ts
grid := getArray2d input |> .map &.map toNumber

ahead: Record<string, ({x,y}: Point<number>) => Point<number>> := 
  N: ({x, y}) => ({x, y: y - 1})
  E: ({x, y}) => ({x: x + 1, y})
  S: ({x, y}) => ({x, y: y + 1})
  W: ({x, y}) => ({x: x - 1, y})

paths := new Set()
trailheads: Point<number>[] := []
loop2d grid, (p, _) => trailheads.push(p) if getGridPoint(grid, p) is 0

function walk(step: Point<number>, start?: Point<number>): number {
  value := getGridPoint grid, step

  if value is 9
    paths.add(`${start.x}, ${start.y} - ${step.x}, ${step.y}`) if start
    return 1

  next := value + 1
  nP := ahead.N step
  eP := ahead.E step
  sP := ahead.S step
  wP := ahead.W step

  (getGridPoint(grid, nP) is next ? walk nP, start : 0) +
  (getGridPoint(grid, eP) is next ? walk eP, start : 0) +
  (getGridPoint(grid, sP) is next ? walk sP, start : 0) +
  (getGridPoint(grid, wP) is next ? walk wP, start : 0)
}

p2 := for sum trailhead of trailheads
  walk trailhead, trailhead

log paths.size
log p2
```

## Day 11: Plutonian Pebbles ⭐⭐

```ts
stones .= toNumbers input

cache := new Map<string, number>()
key := (stone: number, i: number) => `${stone}|${i}`

search := (stone: number, i: number): number =>
  stoneStr := stone.toString()
  if cache.has(key stone, i) 
    return cache.get(key stone, i)!

  if i is 0
    cache.set key(stone, i), 1
    return 1

  if stone is 0
    result := search(1, i - 1)
    cache.set key(stone, i), result
    return result

  if stoneStr# % 2 is 0
    left := int stoneStr[<(stoneStr#/2)]
    right := int stoneStr[>=(stoneStr#/2)]

    result := search(left, i - 1) + search(right, i - 1)
    cache.set key(stone, i), result
    return result

  result := search stone * 2024, i - 1
  cache.set key(stone, i), result
  result

log sum for _, j of stones
  search(stones[j], 25)

log sum for _, j of stones
  search(stones[j], 75)
```

## Day 12: Garden Groups ⭐⭐

```ts
garden := getArray2d input
visited := new Set<string>
CORNERS := [
  [{x: 0, y: -1}, {x: -1, y: 0}, {x: -1, y: -1}],
  [{x: 0, y: 1}, {x: -1, y: 0}, {x: -1, y: 1}],
  [{x: 0, y: -1}, {x: 1, y: 0}, {x: 1, y: -1}],
  [{x: 0, y: 1}, {x: 1, y: 0}, {x: 1, y: 1}]
]

findRegion := ({x, y}: Point<any>, type: string, info: {area: number, perimeter: number, sides: number}): void => 
  key := `${x},${y}`
  if visited.has(key) return
  visited.add key
  info.area++

  for corners of CORNERS
    [p1, p2, d] := [
      getGridPoint(garden, {
        x: x + corners.0.x,
        y: y + corners.0.y
      }),
      getGridPoint(garden, {
        x: x + corners.1.x,
        y: y + corners.1.y
      }),
      getGridPoint(garden, {
        x: x + corners.2.x,
        y: y + corners.2.y
      })
    ]
    if ((p1 is not type and p2 is not type) or (type is p1 and type is p2 and d is not type)) info.sides++

  for p of adjacentCross garden, {x, y}
    if p.value is type
      findRegion p, type, info
    else 
      info.perimeter++

p1 .= 0
p2 .= 0
loop2d garden, (point, type) =>
  info := {area: 0, perimeter: 0, sides: 0}
  findRegion(point, type, info)
  p1 += info.area * info.perimeter
  p2 += info.area * info.sides

log p1
log p2
```

## Day 13: Claw Contraption ⭐⭐

```ts
data := input.split("\n\n").map (group) => group.match(/\d+/g)!.map Number

solve := ([a, c, b, d, x, y]: number[]) =>
  det := a * d - b * c
  if (det is 0) return 0

  n := (d * x - b * y) / det
  m := (-c * x + a * y) / det
  isInteger(n) and isInteger(m) ? 3 * n + m : 0

log for sum v of data
  solve v

log for sum v of data.map (v) => [...v[0..3], v.4 + 1e13, v.5 + 1e13]
  solve v
```

## Day 14: Restroom Redoubt ⭐⭐

```ts
type Robot = {
  position: Point<number>,
  velocity: Point<number>,
}

[EMPTY, FILLED] := [".", "#"]
w := 101
h := 103

midW := int w / 2
midH := int h / 2

teleportIfNeeded := (value: number, min: number, max: number) => ((value % (max - min)) + max) % max - min

function move(robots: Robot[], grid: Grid<string>)
  for {position: {x, y}, velocity}, i of robots
    grid.set x, y, EMPTY
    newX := teleportIfNeeded(x + velocity.x, 0, w)
    newY := teleportIfNeeded(y + velocity.y, 0, h)
    robots[i] = { position: { x: newX, y: newY }, velocity }
    grid.set newX, newY, FILLED

function countRobotsInQuadrants(robots: Robot[])
  counts := [0, 0, 0, 0]

  for { position: {x, y} } of robots
    if (x is midW || y is midH) continue
    quadrant := (x >= midW ? 1 : 0) + (y >= midH ? 2 : 0)
    counts[quadrant]++

  return for product val of counts
    val

function findChristmasTree(grid: Grid<string>)
  test := grid.toString(EMPTY)
  for i of [w..>=7]
    if test.includes(FILLED.repeat i) return true 
  false

lines := getLines input |> .map (l) => l.match(/-?\d+/g)!.map(Number)
grid := Grid.create w, h, EMPTY

robots: Robot[] := []
lines.forEach ([x, y, vx, vy]) =>
  robots.push { position: { x, y }, velocity: { x: vx, y: vy } }
  grid.set x, y, FILLED

i .= 0
loop
  log countRobotsInQuadrants robots if i is 100
  move robots, grid
  i++

  if findChristmasTree grid
    log i
    // log grid.toString()
    break
```

## Day 15: Warehouse Woes ⭐⭐

```ts
data := input.split '\n\n'
grid := new Grid<string> data.0
gridP2 := new Grid<string> data.0.split('\n').map((row) => [...row].map((t) => ({
  '.': '..',
  '@': '@.',
  'O': '[]',
  '#': '##'
}[t])).join('')).join('\n')
moves := data.1.replace /\s/g, ''

next := (p: Point<string>, dir: string, map: Grid<string> ): Point<string> =>
  dest := switch dir
    '>'
      { x: p.x + 1, y: p.y }
    '<'
      { x: p.x - 1, y: p.y }
    '^'
      { x: p.x, y: p.y - 1 }
    else
      { x: p.x, y: p.y + 1 }

  if map.get(dest) is "O"
    next dest, dir, map
  if map.get(dest) is "[" or map.get(dest) is "]"
    if dest.x is not p.x
      next dest, dir, map
    else
      copy := map.clone()
      pair := { ...dest }
      pair.x += map.get(dest) is "[" ? 1 : -1
      if next(dest, dir, copy) is not dest and next(pair, dir, copy) is not pair
        next dest, dir, map
        next pair, dir, map
  
  if map.get(dest) is "."
    map.set dest, map.get(p)
    map.set p, "."
    return dest

  return p

for move of moves
  next grid.find((_,e) => e is '@')!, move, grid
  next gridP2.find((_,e) => e is '@')!, move, gridP2

log for sum {x, y} of grid.findAll (_,e) => e is 'O'
  x + y * 100

log for sum {x, y} of gridP2.findAll (_,e) => e is '['
  x + y * 100
```

## Day 16: Reindeer Maze ⭐⭐

```ts
map := new Grid<string> input
start := map.find((point, value) => value is 'S')!
end := map.find((point, value) => value is 'E')!
type Direction = 'up' | 'down' | 'left' | 'right'
type Item = {
  x: number
  y: number
  direction: Direction
  score: number
  path: Set<string>
}

opposite := { up: "down", down: "up", left: "right", right: "left" }
  
key := (p: Point<string>) => `${p.x},${p.y},${p.direction}`
curr := { ...start, direction: "up", score: 0, path: new Set([`${start.x},${start.y}`]) }
queue := [curr]
visited := new Map [[key({x: start.x, y: start.y, direction: "up"}), curr]]

score .= Infinity
tiles .= null

until !queue#
  curr := queue.shift()! as Item

  if curr.x is end.x and curr.y is end.y
    if curr.score < score then tiles = curr.path.size
    score = Math.min score, curr.score
    continue

  map.getAdjacentPoints(curr) 
  |> .filter (n: Point<string>) => n.direction is not opposite[curr.direction]
  |> .filter (n: Point<string>) => map.get(n) is not '#'
  |> .map (n: Point<string>) =>
    {
      ...n,
      direction: n.direction as Direction,
      path: curr.path.union(new Set([`${n.x},${n.y}`])),
      score: curr.score + (n.direction is curr.direction ? 1 : 1001)
    }
  |> .forEach (n: Item) =>
    prev := visited.get key n
    if !prev or prev.score > n.score
      queue.push n
      visited.set key(n), n
    else if prev.score is n.score
      prev.path = prev.path.union n.path


log score
log tiles
```

## Day 17: Chronospatial Computer ⭐⭐

```ts
enum Reg { A, B, C }

run := (registers: bigint[], program: bigint[]) =>
  ptr .= 0n
  out: bigint[] := []

  runLiteralOp := (op: bigint, cop: bigint) =>
    noJump .= true
    getAdv := (): bigint => registers[Reg.A] / 2n ** getComboVal cop

    switch op
      0n then registers[Reg.A] = getAdv()
      1n then registers[Reg.B] ^= cop
      2n then registers[Reg.B] = getComboVal(cop) % 8n
      3n
        if registers[Reg.A] is not 0n
          ptr = cop
          noJump = false
      4n then registers[Reg.B] ^= registers[Reg.C]
      5n then out.push getComboVal(cop) % 8n
      6n then registers[Reg.B] = getAdv()
      7n then registers[Reg.C] = getAdv()
    noJump

  getComboVal := (op: bigint) => [0n, 1n, 2n, 3n, registers[Reg.A], registers[Reg.B], registers[Reg.C]][int op]

  while ptr < program#
    if runLiteralOp program[int ptr], program[int ptr + 1n]
      ptr += 2n

  out.join ","

[registerLines, programLines] := input.split /\n\n/
registers: bigint[] := getLines registerLines |> .map((l) => l.match(/(\d+)/g)!.map(BigInt)[0])
program := programLines.match(/\d+/g)!.map BigInt

log run registers, program

rp := program.toReversed()
vals .= [0n]
while rp#
  dig := rp.shift()!
  prevVals := vals
  vals = []
  for prev of prevVals
    for i of [0n..8n]
      A := prev * 8n + i
      vals.push A if run([A, 0n, 0n ], program)[0] is dig.toString()
        
log vals.reduce (t, v) => v < t ? v : t // sort and pick smallest value
```

## Day 18: RAM Run ⭐⭐

```ts
wh := 70
f := 1024
bytes := getLines input

run := (fallen = f) =>
  queue: {x:number, y:number, steps: number}[] := [{ x: 0, y: 0, steps: 0 }]
  visited := new Set(["0,0", ...bytes.slice(0, fallen)])
  while (queue.length) {
    curr := queue.shift()!
    if (curr.x === wh && curr.y === wh) return curr.steps
    const neighbors = [
      { x: curr.x + 1, y: curr.y },
      { x: curr.x - 1, y: curr.y },
      { x: curr.x, y: curr.y + 1 },
      { x: curr.x, y: curr.y - 1 },
    ].filter ({ x, y }) => x >= 0 && x <= wh && y >= 0 && y <= wh && !visited.has(`${x},${y}`)
    
    for neighbor of neighbors
      visited.add `${neighbor.x},${neighbor.y}`
      queue.push { ...neighbor, steps: curr.steps + 1 }
  }
  null

log run()

for (let i = f; i < bytes.length; i++) {
  if (run(i) is null)
    log bytes[i - 1]
    break
}
```

## Day 19: Linen Layout ⭐⭐

```ts
count := memo (line: string, patterns: string[]) =>
  if(line# is 0) return 1
  for sum pattern of patterns
    if line.startsWith pattern
      count line.slice(pattern#), patterns
    else 
      0

[patterns, lines] := input.split "\n\n" |> .map((data, index) => data.split index is 1 ? "\n" : ", ")
p1 .= 0
p2 .= 0

for line of lines
  temp := count line, patterns
  p1 += temp ? 1 : 0
  p2 += temp

log p1 - 1 // wtf additional 1 for some reason
log p2 - 1 // wtf
```

## Day 20: Race Condition ⭐⭐

```ts
maze := new Maze<string> input

START := maze.find((_, i) => i is 'S')!
END := maze.find((_, i) => i is 'E')!
save := 100
path := maze.findPath(START, END, (_, val) => val is not '#')!
count := (cheat: number) =>
  for sum i of [0..(path# - save)]
    for sum j of [(i + save)..<path#]
      distance := getManhattanDistance path[i], path[j]
      j - i - distance >= save && distance <= cheat ? 1 : 0

log count 2
log count 20
```

## Day 21: Keypad Conundrum ⭐⭐

```ts
keys := new Grid "789\n456\n123\nX0A"
arrows := new Grid "X^A\n<v>"
keydown := memo (code: string, robots: number, pad) =>
  if robots is 0 
    return code#
  curr .= pad.find "A"
  count .= 0
  for button of code
    to := pad.find(button)!
    queue := [{ p: curr, push: "" }]
    min .= Infinity
    while queue#
      //@ts-ignore
      { p, push } := queue.shift()
      if (isEqual p, pad.find "X") continue
      if (isEqual p, to)
        min = Math.min min, keydown `${push}A`, robots - 1, arrows
      if (to.x > p.x) queue.push { p: {...p, x: p.x + 1}, push: `${push}>` }
      if (to.x < p.x) queue.push { p: {...p, x: p.x - 1}, push: `${push}<` }
      if (to.y > p.y) queue.push { p: {...p, y: p.y + 1}, push: `${push}v` }
      if (to.y < p.y) queue.push { p: {...p, y: p.y - 1}, push: `${push}^` }
    count += min
    curr = to
  count
// +1 since first run is human made
log for sum code of getLines input 
  int(code) * keydown code, 2 + 1, keys
log for sum code of getLines input 
  int(code) * keydown code, 25 + 1, keys
```

## Day 22: Monkey Market ⭐⭐

```ts
numbers := getLines input |> .map BigInt
hash := (n: bigint) => (n = (n ^ n << 6n) % 16777216n, n = n ^ n >> 5n, n = (n ^ n << 11n) % 16777216n, n)
p1 .= numbers
for [0..<2000] p1 = p1.map hash
log int p1.reduce (a, b) => a + b, 0n // need to sum like this because of bigint

p2 .= numbers
differences: bigint[][] := p2.map(() => [])
cache: Record<string, {sum: bigint, row: number[]}> := {}
for [0..<2000]
  p2 = p2.map (curr, index) =>
    next := hash curr
    differences[index].push next % 10n - curr % 10n
    if differences[index]# is 4
      value := cache[differences[index].join(",")] || { sum: 0n, row: [] }
      if !value.row.includes index
        value.row.push index
        value.sum += next % 10n
      cache[differences[index].join(",")] = value
      differences[index].shift()
    next
log Math.max ...Object.values(cache).map (v) => int v.sum
```

## Day 23: LAN Party ⭐⭐

```ts
connect := (networks: string[][], connections: string[][]) =>
  result: Set<string> := new Set()
  for address of networks
    address
      .map((c) => connections.filter (pair) => pair.includes(c) |> .map (pair) => pair.find (x) => x is not c)
      .map (items) => new Set items
      .reduce (a, b) => a.intersection b
      .forEach (intersection) => result.add [...address, intersection].sort().join ","
  result
// p1
connections := getLines input |> .map (line) => line.split "-"
log [...connect connections, connections].filter((x) => x.match(/(^t|,t)/))#
// p2
networks .= connections
while networks# > 1
  networks = [...connect networks, connections].map (x) => x.split ","
log networks[0].sort().join(",")
```
