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
