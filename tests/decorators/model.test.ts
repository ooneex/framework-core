import { describe, expect, it } from 'bun:test';
import { ModelDecoratorException, container, inject, model } from '@';

describe('Model Decorator', () => {
  it('should register a valid model class in the container', () => {
    @model()
    class TestModel {}

    const instance = container.get<TestModel>(TestModel);
    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(TestModel);
  });

  it('should register model class with transient scope', () => {
    @model('transient')
    class TransientScopedModel {}

    const instance1 = container.get<TransientScopedModel>(TransientScopedModel);
    const instance2 = container.get<TransientScopedModel>(TransientScopedModel);
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).not.toBe(instance2);
  });

  it('should register model class with request scope', () => {
    @model('request')
    class RequestScopedModel {}

    const instance1 = container.get<RequestScopedModel>(RequestScopedModel);
    const instance2 = container.get<RequestScopedModel>(RequestScopedModel);
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).not.toBe(instance2);
  });

  it('should register model class with singleton scope by default', () => {
    @model()
    class SingletonScopedModel {}

    const instance1 = container.get<SingletonScopedModel>(SingletonScopedModel);
    const instance2 = container.get<SingletonScopedModel>(SingletonScopedModel);
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).toBe(instance2);
  });

  it('should throw error when decorator is used on invalid class', () => {
    const callback = () => {
      @model()
      // biome-ignore lint/correctness/noUnusedVariables: trust me
      class InvalidClass {}
    };

    expect(callback).toThrow(
      'Model decorator can only be used on model classes. InvalidClass must end with Model keyword.',
    );
    expect(callback).toThrow(ModelDecoratorException);
  });

  it('should properly inject dependencies in model classes', () => {
    @model()
    class DependencyModel {}

    @model()
    class InjectedModel {
      constructor(
        @inject(DependencyModel)
        public dependency: DependencyModel,
      ) {}
    }

    const instance = container.get<InjectedModel>(InjectedModel);

    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(InjectedModel);
    expect(instance.dependency).toBeDefined();
    expect(instance.dependency).toBeInstanceOf(DependencyModel);
  });
});
