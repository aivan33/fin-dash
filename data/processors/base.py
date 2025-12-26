"""Base processor class for data transformations."""

from abc import ABC, abstractmethod
import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


class BaseProcessor(ABC):
    """Abstract base class for data processors.

    Processors transform data after it's fetched from connectors.
    """

    def __init__(self, config: Dict[str, Any] = None):
        """Initialize the processor with configuration.

        Args:
            config: Optional configuration dictionary for the processor
        """
        self.config = config or {}
        logger.info(f"Initializing {self.__class__.__name__}")

    @abstractmethod
    def process(self, data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Process the input data.

        Args:
            data: List of dictionaries to process

        Returns:
            Processed list of dictionaries

        Raises:
            RuntimeError: If processing fails
        """
        pass

    def validate(self, data: List[Dict[str, Any]]) -> bool:
        """Validate input data before processing.

        Override this method to add custom validation.

        Args:
            data: Data to validate

        Returns:
            True if valid, False otherwise
        """
        return isinstance(data, list)
