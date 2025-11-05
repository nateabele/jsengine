defmodule JSEngineTest do
  use ExUnit.Case, async: false
  doctest JSEngine

  describe "run/1" do
    test "executes simple JavaScript code" do
      assert {:ok, nil} = JSEngine.run("var x = 1;")
    end

    test "returns primitive values" do
      assert {:ok, 42} = JSEngine.run("42")
      assert {:ok, 3.14} = JSEngine.run("3.14")
      assert {:ok, "hello"} = JSEngine.run("'hello'")
      assert {:ok, true} = JSEngine.run("true")
      assert {:ok, false} = JSEngine.run("false")
      assert {:ok, nil} = JSEngine.run("null")
      assert {:ok, nil} = JSEngine.run("undefined")
    end

    test "returns arrays" do
      assert {:ok, [1, 2, 3]} = JSEngine.run("[1, 2, 3]")
      assert {:ok, ["a", "b", "c"]} = JSEngine.run("['a', 'b', 'c']")
      assert {:ok, []} = JSEngine.run("[]")
    end

    test "returns objects as maps" do
      assert {:ok, %{"a" => 1, "b" => 2}} = JSEngine.run("({a: 1, b: 2})")
      assert {:ok, %{}} = JSEngine.run("({})")
    end

    test "returns nested structures" do
      assert {:ok, %{"nested" => %{"value" => 42}}} = JSEngine.run("({nested: {value: 42}})")
      assert {:ok, [%{"a" => 1}, %{"b" => 2}]} = JSEngine.run("[{a: 1}, {b: 2}]")
    end

    test "handles arithmetic operations" do
      assert {:ok, 10} = JSEngine.run("5 + 5")
      assert {:ok, 25} = JSEngine.run("5 * 5")
      assert {:ok, 2.5} = JSEngine.run("5 / 2")
    end

    test "handles string operations" do
      assert {:ok, "hello world"} = JSEngine.run("'hello' + ' ' + 'world'")
      assert {:ok, "HELLO"} = JSEngine.run("'hello'.toUpperCase()")
    end

    test "handles JavaScript errors" do
      assert {:error, _} = JSEngine.run("throw new Error('test error')")
      assert {:error, _} = JSEngine.run("undefined.property")
    end

    test "handles syntax errors" do
      assert {:error, _} = JSEngine.run("this is not valid javascript }{")
    end
  end

  describe "call/2" do
    test "calls a defined function with no arguments" do
      assert {:ok, nil} = JSEngine.run("function greet() { return 'hello'; }")
      assert {:ok, "hello"} = JSEngine.call("greet", [])
    end

    test "calls a function with integer arguments" do
      assert {:ok, nil} = JSEngine.run("function add(a, b) { return a + b; }")
      assert {:ok, 3} = JSEngine.call("add", [1, 2])
      assert {:ok, 100} = JSEngine.call("add", [42, 58])
    end

    test "calls a function with float arguments" do
      assert {:ok, nil} = JSEngine.run("function multiply(a, b) { return a * b; }")
      assert {:ok, result} = JSEngine.call("multiply", [3.5, 2.0])
      assert_in_delta result, 7.0, 0.001
    end

    test "calls a function with string arguments" do
      assert {:ok, nil} = JSEngine.run("function concat(a, b) { return a + b; }")
      assert {:ok, "helloworld"} = JSEngine.call("concat", ["hello", "world"])
    end

    test "calls a function with boolean arguments" do
      assert {:ok, nil} = JSEngine.run("function and(a, b) { return a && b; }")
      assert {:ok, true} = JSEngine.call("and", [true, true])
      assert {:ok, false} = JSEngine.call("and", [true, false])
    end

    test "calls a function with array arguments" do
      assert {:ok, nil} = JSEngine.run("function sum(arr) { return arr.reduce((a, b) => a + b, 0); }")
      assert {:ok, 15} = JSEngine.call("sum", [[1, 2, 3, 4, 5]])
    end

    test "calls a function with object arguments" do
      assert {:ok, nil} = JSEngine.run("function getProperty(obj, key) { return obj[key]; }")
      assert {:ok, 42} = JSEngine.call("getProperty", [%{"value" => 42}, "value"])
    end

    test "calls a function with nil/null arguments" do
      assert {:ok, nil} = JSEngine.run("function isNull(val) { return val === null; }")
      assert {:ok, true} = JSEngine.call("isNull", [nil])
    end

    test "calls a function with mixed argument types" do
      assert {:ok, nil} = JSEngine.run("function mixed(num, str, bool, arr) { return {num, str, bool, arr}; }")
      assert {:ok, %{"num" => 42, "str" => "test", "bool" => true, "arr" => [1, 2]}} =
        JSEngine.call("mixed", [42, "test", true, [1, 2]])
    end

    test "returns error when function doesn't exist" do
      assert {:error, _} = JSEngine.call("nonexistent", [])
    end

    test "returns error when calling non-function" do
      assert {:ok, nil} = JSEngine.run("var notAFunction = 42;")
      assert {:error, _} = JSEngine.call("notAFunction", [])
    end

    test "handles function that throws error" do
      assert {:ok, nil} = JSEngine.run("function throwError() { throw new Error('oops'); }")
      assert {:error, _} = JSEngine.call("throwError", [])
    end
  end

  describe "load/1" do
    setup do
      # Create temporary test files
      test_dir = System.tmp_dir!()
      simple_file = Path.join(test_dir, "simple_#{:rand.uniform(10000)}.js")
      function_file = Path.join(test_dir, "functions_#{:rand.uniform(10000)}.js")

      File.write!(simple_file, "var loaded = true;")
      File.write!(function_file, "function fromFile(x) { return x * 2; }")

      on_exit(fn ->
        File.rm(simple_file)
        File.rm(function_file)
      end)

      {:ok, simple_file: simple_file, function_file: function_file}
    end

    test "loads a JavaScript file", %{simple_file: simple_file} do
      assert {:ok, nil} = JSEngine.load([simple_file])
      assert {:ok, true} = JSEngine.run("loaded")
    end

    test "loads multiple JavaScript files", %{simple_file: simple_file, function_file: function_file} do
      assert {:ok, nil} = JSEngine.load([simple_file, function_file])
      assert {:ok, true} = JSEngine.run("loaded")
      assert {:ok, 10} = JSEngine.call("fromFile", [5])
    end
  end

  describe "async operations" do
    test "handles promises that resolve" do
      assert {:ok, nil} = JSEngine.run("function asyncAdd(a, b) { return Promise.resolve(a + b); }")
      assert {:ok, 7} = JSEngine.call("asyncAdd", [3, 4])
    end

    test "handles promises that reject" do
      assert {:ok, nil} = JSEngine.run("function asyncFail() { return Promise.reject('failed'); }")
      assert {:error, _} = JSEngine.call("asyncFail", [])
    end

    test "handles setTimeout" do
      assert {:ok, nil} = JSEngine.run("""
        var timeoutResult = null;
        function setTimeoutTest() {
          return new Promise(resolve => {
            setTimeout(() => resolve('done'), 10);
          });
        }
      """)
      assert {:ok, "done"} = JSEngine.call("setTimeoutTest", [])
    end
  end

  describe "complex data interchange" do
    test "handles deeply nested objects" do
      code = """
      function deepNest() {
        return {
          level1: {
            level2: {
              level3: {
                value: 42,
                array: [1, 2, 3]
              }
            }
          }
        };
      }
      """
      assert {:ok, nil} = JSEngine.run(code)
      assert {:ok, %{"level1" => %{"level2" => %{"level3" => %{"value" => 42, "array" => [1, 2, 3]}}}}} =
        JSEngine.call("deepNest", [])
    end

    test "handles large arrays" do
      assert {:ok, nil} = JSEngine.run("function range(n) { return Array.from({length: n}, (_, i) => i); }")
      assert {:ok, result} = JSEngine.call("range", [100])
      assert length(result) == 100
      assert Enum.at(result, 0) == 0
      assert Enum.at(result, 99) == 99
    end

    test "handles objects with various value types" do
      code = """
      function complexObject() {
        return {
          null_val: null,
          bool_val: true,
          int_val: 42,
          float_val: 3.14,
          string_val: "hello",
          array_val: [1, 2, 3],
          object_val: {nested: true}
        };
      }
      """
      assert {:ok, nil} = JSEngine.run(code)
      assert {:ok, result} = JSEngine.call("complexObject", [])
      assert result["null_val"] == nil
      assert result["bool_val"] == true
      assert result["int_val"] == 42
      assert_in_delta result["float_val"], 3.14, 0.001
      assert result["string_val"] == "hello"
      assert result["array_val"] == [1, 2, 3]
      assert result["object_val"]["nested"] == true
    end

    test "handles empty collections" do
      assert {:ok, nil} = JSEngine.run("function emptyArray() { return []; }")
      assert {:ok, []} = JSEngine.call("emptyArray", [])

      assert {:ok, nil} = JSEngine.run("function emptyObject() { return {}; }")
      assert {:ok, %{}} = JSEngine.call("emptyObject", [])
    end
  end

  describe "edge cases" do
    test "handles negative numbers" do
      assert {:ok, nil} = JSEngine.run("function negate(x) { return -x; }")
      assert {:ok, -42} = JSEngine.call("negate", [42])
      assert {:ok, 42} = JSEngine.call("negate", [-42])
    end

    test "handles zero" do
      assert {:ok, 0} = JSEngine.run("0")
      assert {:ok, nil} = JSEngine.run("function returnZero() { return 0; }")
      assert {:ok, 0} = JSEngine.call("returnZero", [])
    end

    test "handles empty string" do
      assert {:ok, ""} = JSEngine.run("''")
      assert {:ok, nil} = JSEngine.run("function returnEmpty() { return ''; }")
      assert {:ok, ""} = JSEngine.call("returnEmpty", [])
    end

    test "handles special float values" do
      assert {:ok, nil} = JSEngine.run("function infinity() { return 1 / 0; }")
      # Infinity handling might vary, just check it doesn't crash
      assert {result, _} = JSEngine.call("infinity", [])
      assert result in [:ok, :error]
    end

    test "handles very long strings" do
      long_string = String.duplicate("a", 10000)
      assert {:ok, nil} = JSEngine.run("function echo(s) { return s; }")
      assert {:ok, ^long_string} = JSEngine.call("echo", [long_string])
    end

    test "handles unicode strings" do
      assert {:ok, "🚀"} = JSEngine.run("'🚀'")
      assert {:ok, nil} = JSEngine.run("function echoEmoji(e) { return e; }")
      assert {:ok, "🌟"} = JSEngine.call("echoEmoji", ["🌟"])
      assert {:ok, "你好"} = JSEngine.call("echoEmoji", ["你好"])
    end
  end

  describe "JavaScript built-ins" do
    test "Math functions work" do
      assert {:ok, nil} = JSEngine.run("function square(x) { return Math.pow(x, 2); }")
      assert {:ok, 25} = JSEngine.call("square", [5])

      assert {:ok, nil} = JSEngine.run("function squareRoot(x) { return Math.sqrt(x); }")
      assert {:ok, result} = JSEngine.call("squareRoot", [16])
      assert_in_delta result, 4.0, 0.001
    end

    test "Array methods work" do
      code = """
      function arrayOps(arr) {
        return {
          mapped: arr.map(x => x * 2),
          filtered: arr.filter(x => x > 2),
          reduced: arr.reduce((a, b) => a + b, 0)
        };
      }
      """
      assert {:ok, nil} = JSEngine.run(code)
      assert {:ok, result} = JSEngine.call("arrayOps", [[1, 2, 3, 4, 5]])
      assert result["mapped"] == [2, 4, 6, 8, 10]
      assert result["filtered"] == [3, 4, 5]
      assert result["reduced"] == 15
    end

    test "String methods work" do
      code = """
      function stringOps(str) {
        return {
          upper: str.toUpperCase(),
          lower: str.toLowerCase(),
          length: str.length,
          split: str.split(' ')
        };
      }
      """
      assert {:ok, nil} = JSEngine.run(code)
      assert {:ok, result} = JSEngine.call("stringOps", ["Hello World"])
      assert result["upper"] == "HELLO WORLD"
      assert result["lower"] == "hello world"
      assert result["length"] == 11
      assert result["split"] == ["Hello", "World"]
    end

    test "Object methods work" do
      code = """
      function objectOps(obj) {
        return {
          keys: Object.keys(obj),
          values: Object.values(obj),
          entries: Object.entries(obj)
        };
      }
      """
      assert {:ok, nil} = JSEngine.run(code)
      assert {:ok, result} = JSEngine.call("objectOps", [%{"a" => 1, "b" => 2}])
      assert Enum.sort(result["keys"]) == ["a", "b"]
      assert Enum.sort(result["values"]) == [1, 2]
      # entries returns array of arrays
      assert is_list(result["entries"])
    end

    test "JSON methods work" do
      code = """
      function jsonOps(obj) {
        const str = JSON.stringify(obj);
        const parsed = JSON.parse(str);
        return parsed;
      }
      """
      assert {:ok, nil} = JSEngine.run(code)
      assert {:ok, %{"test" => 123}} = JSEngine.call("jsonOps", [%{"test" => 123}])
    end
  end

  describe "state persistence" do
    test "maintains state between run and call" do
      assert {:ok, nil} = JSEngine.run("var counter = 0;")
      assert {:ok, nil} = JSEngine.run("function increment() { return ++counter; }")
      assert {:ok, 1} = JSEngine.call("increment", [])
      assert {:ok, 2} = JSEngine.call("increment", [])
      assert {:ok, 3} = JSEngine.call("increment", [])
    end

    test "functions defined in run can be called later" do
      assert {:ok, nil} = JSEngine.run("function storedFunc(x) { return x * 10; }")
      # Do some other operations
      assert {:ok, nil} = JSEngine.run("var y = 5;")
      # Original function should still be available
      assert {:ok, 100} = JSEngine.call("storedFunc", [10])
    end
  end
end
