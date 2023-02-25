# GitHub Action Javascript

GitHub Action to execute Javascript within workflows.

## Features

- Executes any Javascript code
- Inputs and outputs can be overridden
- Can read arbitrary inputs and write arbitratry outputs

## Usage

### Inputs

| Input                                             | Default  | Description                                                            |
|---------------------------------------------------|----------|------------------------------------------------------------------------|
| `js`<span style="color:red">*</span>              | -        | Javascript code.                                                       |
| `js_input`                                        | `js`     | Override default name `js` input with Javascript code                  |
| `js_result`                                       | `result` | Override default name `result` output with Javascript execution result |

#### Legend

- <span style="color:red">*</span>: Required always

### Outputs

| Output   | Description                |
|----------|----------------------------|
| `result` | Javasript execution result |

## Examples

### Basic

```yaml
- name: Execute Javascript
  uses: amochkin/action-javascript@v1
  with:
    js: |
      console.log('Hello World!')
```

### Read inputs

```yaml
- name: Execute Javascript
  uses: amochkin/action-javascript@v1
  with:
    input_1: 'Hello'
    js: |
      `${input("input_1")} World!`
```

### Write outputs

```yaml
- name: Execute Javascript
  uses: amochkin/action-javascript@v1
  id: <step_id>
  with:
    js: |
      output("output_1", "Hello World!")
- name: Print output
  run: echo ${{ steps.<step_id>.outputs.output_1 }}
```
