<br>
<br>

<div align="center">
  <img width="125" height="125" src="images/gof-java.png" alt="design-patterns-for-java"/>

<h3 align="center">Design Patterns Snippets for Java</h3>

  <p align="center">
    Enhance your Java code with design patterns and improve your development workflow with the Design Patterns Extension for VS Code!
  </p>

</div>

## Overview

The Design Patterns Extension for Visual Studio Code helps you seamlessly apply the Gang of Four (GoF) design patterns to your Java code. Enhance your code's structure and maintainability by generating pattern-specific boilerplate code with just a few clicks!

## Features

- **Singleton Pattern:** Ensure a class has only one instance and provide a global point of access to it.
- **Factory Method Pattern:** Define an interface for creating an object, but let subclasses alter the type of objects that will be created.
- **Builder Pattern:** Simplify object creation by defining a step-by-step process and constructing complex objects through a chain of method calls.

## Installation

1. Open Visual Studio Code.
2. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window or by pressing `Ctrl+Shift+X`.
3. Search for "Design Patterns Extension".
4. Click `Install` to install the extension.
5. Reload Visual Studio Code to activate the extension.

## Usage

1. Open a Java file containing a class.
2. Press `Ctrl+Shift+P` to open the Command Palette.
3. Start typing "Apply" to see the available commands for applying design patterns.
4. Select one of the following commands:
   - `Apply Singleton Pattern`
   - `Apply Factory Method Pattern`
   - `Apply Builder Pattern`

The selected pattern will be applied to the class in the active editor.

## Example

### Before Applying Builder Pattern

```java
public class MyClass {
    private int value;
    private String name;

    // Some code here
}
```

### After Applying Builder Pattern

```java

public class MyClass {
    private int value;
    private String name;

    public static class Builder {
        private int value;
        private String name;

        public Builder() {}

        public Builder value(int value) {
            this.value = value;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public MyClass build() {
            return new MyClass(this);
        }
    }

    private MyClass(Builder builder) {
        this.value = builder.value;
        this.name = builder.name;
    }

    public static Builder builder() {
        return new Builder();
    }

    // Some code here
}
```

## Contributing

Contributions are welcome! If you have suggestions for additional features or patterns, feel free to open an issue or submit a pull request on [GitHub](https://github.com/josafamarengo/design-patterns-extension/issues).

## License

This extension is licensed under the GLPv3 License. See the [LICENSE](LICENSE) file for more details.

## Contact

If you have any questions, suggestions, or feedback, feel free to reach out!
- Website: [josafa.com.br](https://josafa.com.br)
- GitHub: [@josafamarengo](https://github.com/josafamarengo)
- LinkedIn: [@josafamarengo](https://linkedin.com/in/josafamarengo)
- Email: josafabmarengo@gmail.com
