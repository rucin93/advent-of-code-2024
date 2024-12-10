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
points: Point[][] := flatten for x of [-1..1]
  for y of [-1..1]
    for l of [1..3]
      {x: x * l, y: y * l}

log sumLoop2d map, (y, x, item) =>
  if item is not 'X' return 0
  sum points.map (row) =>
    'MAS' is for join point of row
      map[y + point.y]?[x + point.x]

validDiagonals := ['MS', 'SM']
log sumLoop2d map, (y, x, item) =>
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

walk := (grid: string[][], { x, y }: Point, dir: Direction) =>
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

loop2d grid, (y, x, freq) =>
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

hash := (b: string, i: number) => b is '.' ? 0 : i * (-move + int b.codePointAt 0)

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

ahead: Record<string, ({x,y}: Point) => Point> := 
  N: ({x, y}) => ({x, y: y - 1})
  E: ({x, y}) => ({x: x + 1, y})
  S: ({x, y}) => ({x, y: y + 1})
  W: ({x, y}) => ({x: x - 1, y})

paths := new Set()
trailheads: Point[] := []
loop2d grid, (x, y, _) => trailheads.push({x, y}) if getGridPoint(grid, {x, y}) is 0

function walk(step: Point, start?: Point): number {
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
