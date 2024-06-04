import { DataSource, EntityManager } from 'typeorm'

export const startTransaction = async (
  dataSource: DataSource
): Promise<EntityManager> => {
  const queryRunner = dataSource.createQueryRunner()
  await queryRunner.connect()
  await queryRunner.startTransaction()
  return queryRunner.manager
}

export const commitTransaction = async (
  entityManager: EntityManager
): Promise<void> => {
  const queryRunner = entityManager.queryRunner
  if (queryRunner) {
    await queryRunner.commitTransaction()
    await queryRunner.release()
  }
}

export const rollbackTransaction = async (
  entityManager: EntityManager
): Promise<void> => {
  const queryRunner = entityManager.queryRunner
  if (queryRunner) {
    await queryRunner.rollbackTransaction()
    await queryRunner.release()
  }
}
